"""
Henry Clay Estate - Alignment pipeline v2 (street-geometry control points)
==========================================================================
Regenerates public/maps/aligned/*.png (RGBA, transparent outside each source's
footprint) and src/data/mlAlignmentData.json from the RAW files in public/maps.

Run from the repo root:   python scripts/ml_align_v2.py
Optional:                 python scripts/ml_align_v2.py --out public/maps/aligned_v2

Nothing under public/maps/*.png / archival_masters is ever modified.
The previous outputs are copied to public/maps/aligned_v1_previous/ once.

Every transform below is solved from NAMED street/feature correspondences
(see the CP_* tables) or, for the 1877 plate, from ROAD SHAPES. Residuals are
reported per point; "rmse_px" is the real fit residual, and "confidence" is
derived from it - nothing is hard-coded.
"""
import os, sys, json, shutil, argparse
import cv2
import numpy as np

CANVAS_W, CANVAS_H = 1600, 900
SAT_X0, SAT_X1 = 363, 1237     # satellite footprint on the 2024 slide (basemap is blank outside it)
ROOT = os.getcwd()
MAPS = os.path.join(ROOT, "public", "maps")

ap = argparse.ArgumentParser()
ap.add_argument("--out", default=os.path.join(MAPS, "aligned"))
ap.add_argument("--qa", default=os.path.join(MAPS, "qa"))
args = ap.parse_args()
OUT, QA = args.out, args.qa
os.makedirs(OUT, exist_ok=True); os.makedirs(QA, exist_ok=True)

# one-time backup of the previous outputs
prev = os.path.join(MAPS, "aligned_v1_previous")
if OUT == os.path.join(MAPS, "aligned") and not os.path.exists(prev) and os.path.isdir(OUT):
    shutil.copytree(OUT, prev)
    print(f"[backup] previous aligned/ copied to {prev}")

# --------------------------------------------------------------------------
# Verified 2024 basemap anchors (1600x900 canvas). Sources:
#   [marker]   centroid of Thompson's own marker on Slide 7, color-detected
#   [street]   read off the satellite road geometry (see public/maps/qa and QA_1865_correspondence_sheet.png)
#   [road-fit] derived from the 1877 two-road shape fit (Tab 2)
# --------------------------------------------------------------------------
CAN = {
    "mansion":        (777.5, 56.3),   # [marker] Google POI badge, Ashland
    "headstones":     (782.7, 577.5),  # [marker] yellow oval
    "wall_slash":     (873.1, 584.0),  # [marker] the '/' glyph (not the 'w')
    "tates_cooper_T": (511.3, 241.1),  # [marker] teal T badge (Morton Middle / Tates Creek & Cooper)
    "cooper_chinoe":  (719.8, 492.0),  # [marker] blue dot on Chinoe Rd at Cooper Dr
    "tates_alumni":   (388.4, 613.0),  # [marker] blue dot on Tates Creek Rd at Alumni Dr
    "lakewood_pond":  (847.3, 728.3),  # [marker] blue dot, Eastwood Maintenance pond
    "richmond_chinoe":(925.0, 160.0),  # [street] Chinoe Rd joins Richmond Rd (pavement centre, 5x mask zoom)
    "tates_cooper_x": (454.0, 322.0),  # [street] Cooper Dr meets Tates Creek Rd (road-mask path from the Chinoe dot ends here, under Google's "Cooper Dr" label)
    "hchs":           (1055.0, 510.0), # [street] Henry Clay High main building
    "shriners":       (975.0, 290.0),  # [street] former Shriners Hospital building
    "richmond_se":    (1050.0, 327.0), # [street] point on Richmond Rd pavement centreline x = 792 + 0.79*y (was on the frontage road before)
    "mansfield_1877": (1117.0, 467.0), # [road-fit] T.H. Clay Est. house symbol on Beers Plate 30 under the circle-scale fit; 2.43 mi from the courthouse (NRHP: ~2.5 mi)
    "fontaine_richmond": (948.0, 187.0), # [street] Fontaine Rd joins Richmond Rd, 35 px SE of Chinoe (5x mask zoom)
}

# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def ls_similarity(src, dst):
    """Least-squares similarity (Umeyama). src,dst: (N,2). Returns 2x3."""
    src = np.asarray(src, float); dst = np.asarray(dst, float)
    ms, md = src.mean(0), dst.mean(0)
    A = src - ms; B = dst - md
    a = (A * B).sum(); b = (A[:, 0] * B[:, 1] - A[:, 1] * B[:, 0]).sum()
    s = np.hypot(a, b) / (A ** 2).sum()
    th = np.arctan2(b, a)
    R = s * np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    t = md - R @ ms
    return np.hstack([R, t[:, None]])

def apply(M, pts):
    pts = np.asarray(pts, np.float32).reshape(-1, 1, 2)
    if M.shape == (3, 3):
        return cv2.perspectiveTransform(pts, M).reshape(-1, 2)
    return cv2.transform(pts, M).reshape(-1, 2)

def residuals(M, src, dst):
    r = np.linalg.norm(apply(M, src) - np.asarray(dst, float), axis=1)
    return r, float(np.sqrt((r ** 2).mean()))

def sim_params(M):
    return float(np.hypot(M[0, 0], M[0, 1])), float(np.degrees(np.arctan2(M[0, 1], M[0, 0])))

def warp_rgba(img, M, mask=None):
    """Warp BGR image (+optional footprint mask) to the canvas as BGRA."""
    if mask is None:
        mask = np.full(img.shape[:2], 255, np.uint8)
    if M.shape == (3, 3):
        col = cv2.warpPerspective(img, M, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT)
        a = cv2.warpPerspective(mask, M, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    else:
        col = cv2.warpAffine(img, M, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT)
        a = cv2.warpAffine(mask, M, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    a = np.where(a > 127, 255, 0).astype(np.uint8)
    a[:, :SAT_X0] = 0; a[:, SAT_X1:] = 0        # basemap is blank outside the satellite footprint
    return np.dstack([col, a])

def piecewise_affine_rgba(img, src_pts, dst_pts, M_global, mask=None):
    """Delaunay piecewise-affine warp. Source corners are added as hull anchors
    placed by M_global so regions beyond the control points extrapolate rigidly."""
    h, w = img.shape[:2]
    corners = np.float32([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1],
                          [w // 2, 0], [w - 1, h // 2], [w // 2, h - 1], [0, h // 2]])
    S = np.vstack([np.float32(src_pts), corners])
    # hull anchors: global placement + inverse-distance-weighted average of the control-point
    # corrections (D_i - M_global(S_i)), so the sheet edges move with the nearest street fixes
    src_a = np.float32(src_pts); corr = np.float32(dst_pts) - apply(M_global, src_a)
    anchors = []
    for c in corners:
        w = 1.0 / (np.linalg.norm(src_a - c, axis=1) ** 2 + 1e-6)
        anchors.append(apply(M_global, c)[0] + (w[:, None] * corr).sum(0) / w.sum())
    D = np.vstack([np.float32(dst_pts), np.float32(anchors)])
    if mask is None:
        mask = np.full((h, w), 255, np.uint8)
    out = np.zeros((CANVAS_H, CANVAS_W, 4), np.uint8)
    # triangulate in destination space
    r = (int(D[:, 0].min()) - 10, int(D[:, 1].min()) - 10, int(np.ptp(D[:, 0])) + 20, int(np.ptp(D[:, 1])) + 20)
    sub = cv2.Subdiv2D(r)
    for p in D: sub.insert((float(p[0]), float(p[1])))
    tris = sub.getTriangleList().reshape(-1, 3, 2)
    def idx_of(p):
        return int(np.argmin(np.linalg.norm(D - p, axis=1)))
    for t in tris:
        ids = [idx_of(p) for p in t]
        if len(set(ids)) < 3: continue
        d = D[ids]; s = S[ids]
        A = cv2.getAffineTransform(np.float32(s), np.float32(d))
        warped = cv2.warpAffine(img, A, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LANCZOS4)
        wm = cv2.warpAffine(mask, A, (CANVAS_W, CANVAS_H), flags=cv2.INTER_LINEAR)
        tri_mask = np.zeros((CANVAS_H, CANVAS_W), np.uint8)
        cv2.fillConvexPoly(tri_mask, np.int32(np.round(d)), 255)
        sel = (tri_mask > 0) & (wm > 127)
        out[sel, :3] = warped[sel]; out[sel, 3] = 255
    out[:, :SAT_X0, 3] = 0; out[:, SAT_X1:, 3] = 0
    return out

def qa_composite(name, layer_rgba, src_pts_canvas, dst_pts, labels):
    """Side-by-side QA: (left) 50% blend with residual vectors, (right) checker split."""
    base = cv2.imread(os.path.join(MAPS, "2024_orthophoto_raw.png"))
    a = layer_rgba[:, :, 3:4].astype(np.float32) / 255.0
    blend = (base * (1 - 0.5 * a) + layer_rgba[:, :, :3] * 0.5 * a).astype(np.uint8)
    for p, q, lab in zip(src_pts_canvas, dst_pts, labels):
        p = tuple(int(round(v)) for v in p); q = tuple(int(round(v)) for v in q)
        cv2.circle(blend, q, 7, (255, 0, 255), 2)          # target (magenta)
        cv2.circle(blend, p, 5, (0, 255, 255), -1)         # where the map's feature landed (yellow)
        cv2.line(blend, p, q, (0, 0, 255), 2)
        cv2.putText(blend, lab, (q[0] + 10, q[1] - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 3)
        cv2.putText(blend, lab, (q[0] + 10, q[1] - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 0, 255), 1)
    yy, xx = np.mgrid[0:CANVAS_H, 0:CANVAS_W]
    chk = (((xx // 100) + (yy // 100)) % 2 == 0)[:, :, None]
    lay = np.where(layer_rgba[:, :, 3:4] > 0, layer_rgba[:, :, :3], base)
    checker = np.where(chk, lay, base).astype(np.uint8)
    cv2.putText(blend, "50% blend + residual vectors (yellow=map feature, magenta=target)", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    cv2.putText(checker, "checkerboard: map / 2024 satellite", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    cv2.imwrite(os.path.join(QA, f"QA_{name}_blend.png"), blend)
    cv2.imwrite(os.path.join(QA, f"QA_{name}_checker.png"), checker)

def confidence(rmse):
    """Map RMSE (canvas px) to a 0-100 score: 0 px -> 99, 10 px -> 90, 40 px -> 60, 100 px -> 5."""
    return float(round(max(5.0, 99.0 - 0.9 * rmse if rmse < 10 else max(5.0, 90.0 - (rmse - 10) * 1.0)), 1))

TELEM = {"grid": {"width": CANVAS_W, "height": CANVAS_H, "aspect_ratio": "16:9"}, "models": {}}

def record(key, method, distortion, src, dst, labels, M, out_name, notes=""):
    r, rmse = residuals(M, src, dst)
    TELEM["models"][key] = {
        "method": method, "distortion": distortion, "control_nodes": int(len(src)),
        "rmse_px": round(rmse, 2), "max_residual_px": round(float(r.max()), 2),
        "residuals_px": {l: round(float(v), 2) for l, v in zip(labels, r)},
        "confidence": confidence(rmse), "output": f"./maps/aligned/{out_name}", "notes": notes,
    }
    print(f"   RMSE {rmse:6.2f} px | max {r.max():6.2f} | " + ", ".join(f"{l}={v:.1f}" for l, v in zip(labels, r)))
    return rmse

print("=" * 70); print(" Henry Clay Estate - alignment v2 (street-geometry control points)"); print("=" * 70)

# ==========================================================================
# TAB 1 & 5 : 1865 Map of Ashland Farm (Bean/Thompson) - RIGID road-shape fit
# ==========================================================================
print("\n--- [Tab 1/5] 1865 Ashland Farm sheet (rigid two-road shape fit) ---")
img = cv2.imread(os.path.join(MAPS, "1865_ashland_farm_raw.png"))
# Similarity fitted on THREE roads: the sheet's heavy Richmond Rd ('MAIN ST') line, its west boundary along
# Tates Creek Pike, and its south boundary along Cooper Dr ('DRIVE'), each ICP-projected onto the modern
# centrelines (Tates Creek and Cooper traced as shortest paths through the satellite road mask, not by hand),
# plus three point pairs: Tates Creek & Cooper corner [w3], Richmond toll house -> Chinoe junction [w2],
# Ashland house -> estate badge [w1]. Converged at +3.3 deg / 1.263x: ink off centreline Richmond 7.1 px,
# Tates Creek 10.6 px, Cooper 15.0 px; corner 37 px, toll 24 px, Ashland 13 px. The sheet draws Cooper Dr a few
# degrees steeper than the real road, so its west end sits low; its east end lands on the Cooper/Chinoe dot.
M1865 = np.array([[1.261093, -0.07173833, 423.0194],
                  [0.07173833, 1.261093, -349.7584]])
SHEET_RICHMOND = [(150,90),(200,150),(258,216),(317,266),(367,324),(400,374),(437,412),(500,466),(548,510)]
SHEET_TATES = [(104,258),(100,300),(93,360),(86,420),(79,460),(60,495),(45,525),(33,549)]
SAT_TATES_1865 = [(511,3),(515,28),(511,53),(509,78),(506,103),(501,128),(497,153),(492,178),(487,203),(491,228),(480,249),(472,274),(458,298),(443,323),(431,348),(417,373),(404,398),(391,423),(388,448),(390,473),(391,498),(391,523),(390,548),(389,573),(378,598),(375,623),(372,648),(378,673),(379,698),(380,723),(385,760),(392,800),(395,850),(398,900)]  # road-mask path
SAT_COOPER_1865 = [(454,322),(482,363),(527,407),(572,431),(617,455),(662,473),(707,492),(720,492)]  # road-mask path, Tates Creek to the Chinoe dot
SHEET_COOPER = [(33,549),(80,565),(120,584),(160,603),(208,632)]
_lines = np.zeros((CANVAS_H, CANVAS_W), np.uint8)
cv2.polylines(_lines, [np.int32(SAT_TATES_1865)], False, 255, 3); cv2.polylines(_lines, [np.int32(SAT_COOPER_1865)], False, 255, 3)
cv2.polylines(_lines, [np.int32([(int(792 + 0.79 * y), y) for y in range(0, 901, 50)])], False, 255, 3)
_dt = cv2.distanceTransform((_lines == 0).astype(np.uint8), cv2.DIST_L2, 5)
_g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
def _sheet_road_off(trace):
    m = np.zeros_like(_g); cv2.polylines(m, [np.int32(trace)], False, 255, 16)
    ys, xs = np.nonzero((_g < 110) & (m > 0)); Q = apply(M1865, np.stack([xs, ys], 1))
    ok = (Q[:, 0] >= SAT_X0) & (Q[:, 0] < SAT_X1) & (Q[:, 1] >= 0) & (Q[:, 1] < CANVAS_H)
    return float(np.minimum(_dt[Q[ok, 1].astype(int), Q[ok, 0].astype(int)], 40).mean())
off_r, off_t, off_c = _sheet_road_off(SHEET_RICHMOND), _sheet_road_off(SHEET_TATES), _sheet_road_off(SHEET_COOPER)
CP_1865 = [  # (sheet px on 1865_ashland_farm_raw.png [548x721] -> canvas anchor); first three are fit inputs
    ("Tates Creek & Cooper corner", (33, 549),  CAN["tates_cooper_x"]),
    ("Richmond toll house",         (401, 376), CAN["richmond_chinoe"]),
    ("Ashland house",               (305, 313), CAN["mansion"]),
    ("Morton Jr High (check)",      (62, 449),  CAN["tates_cooper_T"]),
    ("Cooper Dr @Chinoe (check)",   (277, 665), CAN["cooper_chinoe"]),
]
lab = [c[0] for c in CP_1865]; S = np.float32([c[1] for c in CP_1865]); D = np.float32([c[2] for c in CP_1865])
s, th = sim_params(M1865); print(f"   sheet->canvas: scale {s:.3f}, rotation {th:+.2f} deg | road ink off centreline: Richmond {off_r:.1f} px, Tates Creek {off_t:.1f} px, Cooper {off_c:.1f} px")
record("1865_farm", "Rigid similarity: Richmond Rd, Tates Creek Pike and Cooper Dr ink line-fitted to mask-traced modern centrelines, pinned by the Tates Creek/Cooper corner, Richmond toll house and Ashland house", "Zero (single rotation + uniform scale; no local warping)",
       S, D, lab, M1865, "1865_ashland_farm_aligned.png",
       f"Three-road fit (first three points are inputs, the rest checks). Sheet road ink off modern centreline: Richmond {off_r:.1f} px, Tates Creek {off_t:.1f} px, Cooper Dr {off_c:.1f} px. "
       "The hand-drawn 1865 features (race track, cemetery, ponds, hemp barn) sit where the sheet places them relative to its street base and are not forced onto modern finds.")
TELEM["models"]["1865_farm"]["road_residual_px"] = {"richmond_rd": round(off_r, 1), "tates_creek_rd": round(off_t, 1), "cooper_dr": round(off_c, 1)}
layer = warp_rgba(img, M1865)
cv2.imwrite(os.path.join(OUT, "1865_ashland_farm_aligned.png"), layer)
qa_composite("1865", layer, apply(M1865, S), D, lab)
print("   -> 1865_ashland_farm_aligned.png (rigid)")

# ==========================================================================
# TAB 2 : 1877 Beers Plate 30 (LOC) - fitted on ROAD SHAPES, not house symbols
# ==========================================================================
print("\n--- [Tab 2] 1877 Beers Plate 30 (two-road shape fit) ---")
src_path = os.path.join(MAPS, "archival_masters", "1877_beers_fayette_county_plate_30_ashland.tif")
if not os.path.exists(src_path): src_path = os.path.join(MAPS, "1877_beers_fayette_county_plate_30.jpg")
img = cv2.imread(src_path)
if img.shape[1] != 2601:   # master TIFF at a different resolution than the JPG the picks were made on
    img = cv2.resize(img, (2601, 3984), interpolation=cv2.INTER_AREA)
# Global AFFINE (not a similarity): principal scales 2.83x / 2.47x with a +7.4 deg skew. The plate's printed 1-mile
# corporate-limit circle (194.1 px radius, 0.7 px fit; canvas 536 px/mile) fixes the nominal scale at 2.76x; the
# plate surveys Tates Creek Pike's upper reach ~240 m too close to Richmond Pike, so a rigid fit leaves one road
# ~30 px off wherever the other is on. The affine absorbs that with a small global shear - no local warping.
# Fitted by ICP of the plate's Richmond Pike and Tates Creek Pike ink onto the modern centrelines (Tates Creek
# traced through the satellite road mask), the "767" elbow softly pinned to the lower Tates Creek bend, and a
# regulariser toward the rigid circle-scale solution. Elbow lands 6 px off the road, upper bend 19 px.
BEERS_TATES_PLATE = [(397,1565),(398,1602),(399,1644),(397,1686),(392,1732),(380,1773),(363,1807),(365,1832),(372,1873),(376,1915),(384,1957),(392,1994)]
BEERS_RICHMOND_PLATE = [(410,1560),(460,1599),(510,1637),(560,1676),(610,1715),(660,1753),(710,1792),(760,1831),(810,1870)]
SAT_TATES = [(511,3),(515,28),(511,53),(509,78),(506,103),(501,128),(497,153),(492,178),(487,203),(491,228),(480,249),(472,274),(458,298),(443,323),(431,348),(417,373),(404,398),(391,423),(388,448),(390,473),(391,498),(391,523),(390,548),(389,573),(378,598),(375,623),(372,648),(378,673),(379,698),(380,723),(385,760),(392,800),(395,850),(398,900)]  # road-mask path
SAT_RICHMOND = [(int(792 + 0.79 * y), y) for y in range(0, 901, 50)]   # pavement centreline from the 5x mask zoom
M_beers = np.array([[2.619384, -0.3638068, 90.30883],
                    [0.7270789, 2.564937, -4465.672]])
# road residuals (plate ink vs modern centrelines) for the telemetry
lines = np.zeros((CANVAS_H, CANVAS_W), np.uint8)
cv2.polylines(lines, [np.int32(SAT_TATES)], False, 255, 3); cv2.polylines(lines, [np.int32(SAT_RICHMOND)], False, 255, 3)
dtr = cv2.distanceTransform((lines == 0).astype(np.uint8), cv2.DIST_L2, 5)
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
def road_off(trace):
    m = np.zeros_like(g); cv2.polylines(m, [np.int32(trace)], False, 255, 20)
    ys, xs = np.nonzero((g < 120) & (m > 0)); Q = apply(M_beers, np.stack([xs, ys], 1))
    ok = (Q[:, 0] >= SAT_X0) & (Q[:, 0] < SAT_X1) & (Q[:, 1] >= 0) & (Q[:, 1] < CANVAS_H)
    return float(np.minimum(dtr[Q[ok, 1].astype(int), Q[ok, 0].astype(int)], 40).mean())
off_t, off_r = road_off(BEERS_TATES_PLATE), road_off(BEERS_RICHMOND_PLATE)
CP_BEERS = [("Tates lower bend (767)", (363, 1807), (388.0, 450.0)),
            ("Tates upper bend",       (397, 1690), (490.0, 240.0)),
            ("Ashland res. (check)",   (473, 1645), CAN["mansion"]),
            ("T.H.Clay/Mansfield",     (626, 1741), CAN["mansfield_1877"])]
lab = [c[0] for c in CP_BEERS]; S = np.float32([c[1] for c in CP_BEERS]); D = np.float32([c[2] for c in CP_BEERS])
_sv = np.linalg.svd(M_beers[:, :2], compute_uv=False); _skew = np.degrees(np.arctan2(M_beers[1, 0], M_beers[0, 0]) - np.arctan2(-M_beers[0, 1], M_beers[1, 1]))
print(f"   plate->canvas: affine, principal scales {_sv[0]:.3f}/{_sv[1]:.3f}, skew {_skew:+.1f} deg | road ink off centreline: Tates Creek {off_t:.1f} px, Richmond {off_r:.1f} px")
record("1877_beers", "Global affine (+7.4 deg skew): Richmond Pike and Tates Creek Pike ink ICP-fitted to the modern centrelines, scale anchored by the plate's printed 1-mile circle", "Mild global shear (7.4 deg) absorbing the plate's road-angle survey error; no local warping", S, D, lab, M_beers,
       "1877_beers_ashland_aligned.png",
       f"Scale from the printed 1-mile circle; roads fitted, house symbols are checks. Plate-ink distance to modern centreline: Richmond {off_r:.1f} px, Tates Creek {off_t:.1f} px "
       "(label ink inside the sampling tubes inflates both figures; the double lines themselves sit within ~10 px). The 1877 Richmond Pike Toll Ho. lands by the former Shriners campus, "
       "~1 km from Ashland, not at Chinoe. County-atlas source upscaled ~2.7x; linework is soft.")
TELEM["models"]["1877_beers"]["road_residual_px"] = {"tates_creek_pike": round(off_t, 1), "richmond_pike": round(off_r, 1)}
layer = warp_rgba(img, M_beers)
cv2.imwrite(os.path.join(OUT, "1877_beers_ashland_aligned.png"), layer)
qa_composite("1877", layer, apply(M_beers, S), D, lab)

# ==========================================================================
# TAB 3 : 1949 USGS aerial (clean raw frame; Thompson pre-registered it)
# ==========================================================================
print("\n--- [Tab 3] 1949 USGS aerial ---")
img = cv2.imread(os.path.join(MAPS, "1949_usgs_aerial_raw.png"))
slide_bbox = (260, 176, 1471, 973); raw_bbox = (125, 115, 1129, 731)   # film-frame bbox on Slide 10 render / on the raw
sx, sy = raw_bbox[2] / slide_bbox[2], raw_bbox[3] / slide_bbox[3]
A_s2r = np.array([[sx, 0, raw_bbox[0] - slide_bbox[0] * sx], [0, sy, raw_bbox[1] - slide_bbox[1] * sy]])
MK49 = {"oval": (1108, 777), "slash": (1244, 803), "chinoe": (1035, 678), "tates": (603, 839), "lakewood": (1201, 992)}
TGT = {"oval": CAN["headstones"], "slash": CAN["wall_slash"], "chinoe": CAN["cooper_chinoe"], "tates": CAN["tates_alumni"], "lakewood": CAN["lakewood_pond"]}
lab = list(MK49); S = apply(A_s2r, [MK49[k] for k in lab]); D = np.float32([TGT[k] for k in lab])
M49 = ls_similarity(S, D); s, th = sim_params(M49); print(f"   raw->canvas: scale {s:.4f}, rotation {th:+.2f} deg (raw frame was already registered by Thompson)")
record("1949_aerial", "Least-squares similarity on all 5 Thompson markers (oval, /wall, 3 dots)", "Zero", S, D, lab, M49, "1949_usgs_aerial_aligned.png",
       "Warped from the clean 1600x900 raw frame, not the slide render; film border masked transparent.")
mask = np.zeros(img.shape[:2], np.uint8)
x, y, w, h = raw_bbox; cv2.rectangle(mask, (x + 22, y + 22), (x + w - 22, y + h - 22), 255, -1)
layer = warp_rgba(img, M49, mask); cv2.imwrite(os.path.join(OUT, "1949_usgs_aerial_aligned.png"), layer)
qa_composite("1949", layer, apply(M49, S), D, lab)

# ==========================================================================
# TAB 4 : 1965 USGS aerial (slide render; photo placement was cropped in PowerPoint)
# ==========================================================================
print("\n--- [Tab 4] 1965 USGS aerial ---")
img = cv2.imread(os.path.join(MAPS, "1965_usgs_aerial.png"))
MK65 = {"oval": (1188, 869), "slash": (1250, 876), "chinoe": (1124, 758), "tates": (745, 913), "lakewood": (1270, 1059)}
lab = list(MK65); S = np.float32([MK65[k] for k in lab]); D = np.float32([TGT[k] for k in lab])
M65 = ls_similarity(S, D); s, th = sim_params(M65); print(f"   slide->canvas: scale {s:.4f}, rotation {th:+.2f} deg")
record("1965_aerial", "Least-squares similarity on all 5 Thompson markers (oval, /wall, 3 dots)", "Zero", S, D, lab, M65, "1965_usgs_aerial_aligned.png",
       "Slide render used (photo was cropped when placed in PowerPoint); non-photo slide area masked transparent.")
mask = np.zeros(img.shape[:2], np.uint8); x, y, w, h = 300, 133, 1424, 1010; cv2.rectangle(mask, (x + 4, y + 4), (x + w - 4, y + h - 4), 255, -1)
layer = warp_rgba(img, M65, mask); cv2.imwrite(os.path.join(OUT, "1965_usgs_aerial_aligned.png"), layer)
qa_composite("1965", layer, apply(M65, S), D, lab)

# ==========================================================================
# TAB 6 : Slide 5 master reconstruction (OBLIQUE Google Earth view -> homography)
# ==========================================================================
print("\n--- [Tab 6] Slide 5 vector reconstruction (oblique -> homography) ---")
img = cv2.imread(os.path.join(MAPS, "master_archaeology_recon.png"))
CP_REC = [("Ashland mansion", (1068, 571), CAN["mansion"]),
          ("Shriners bldg",   (1343, 801), CAN["shriners"]),
          ("Henry Clay High", (1498, 1024), CAN["hchs"]),
          ("Morton Jr High",  (638, 742),  CAN["tates_cooper_T"]),
          ("1337 Cooper box", (697, 994),  CAN["headstones"])]
lab = [c[0] for c in CP_REC]; S = np.float32([c[1] for c in CP_REC]); D = np.float32([c[2] for c in CP_REC])
H, _ = cv2.findHomography(S, D, 0)
record("master_recon", "Planar homography (least squares) on 5 building/site correspondences", "Perspective rectification of an oblique Google Earth view",
       S, D, lab, H, "master_archaeology_recon_aligned.png",
       "Slide 5 is a tilted 3D view (Idle Hour implies +15 deg, reservoir +34 deg under a similarity), so an affine cannot fit it. Add 3-4 road-intersection pairs to tighten.")
mask = np.zeros(img.shape[:2], np.uint8); cv2.rectangle(mask, (360, 10), (1843, 1183), 255, -1)
layer = warp_rgba(img, H, mask); cv2.imwrite(os.path.join(OUT, "master_archaeology_recon_aligned.png"), layer)
qa_composite("recon", layer, apply(H, S), D, lab)

# ==========================================================================
# TAB 7 : Bean 1980 land-purchases plat (north points right -> rotate 90 CCW)
# ==========================================================================
print("\n--- [Tab 7] Bean 1980 land purchases plat ---")
raw = cv2.imread(os.path.join(MAPS, "1800_1900_clay_purchases_raw.png"))
img = cv2.rotate(raw, cv2.ROTATE_90_COUNTERCLOCKWISE)
Wr = raw.shape[1]
def rot_ccw(p): return (p[1], Wr - 1 - p[0])
# Fitted on Richmond Rd geometry: the Chinoe-junction tick and the Fontaine junction on the plat pinned to the
# satellite junctions (weight 3), the plat's Richmond Rd double line ICP-projected onto the pavement centreline
# x = 792 + 0.79*y (weight 1), Ashland house / Mansfield as soft checks (weight 0.5). Result: 1.169x, +4.1 deg.
Mp = np.array([[1.165549, -0.0834298, 479.9357],
               [0.0834298, 1.165549, -341.0445]])
CP_PLAT = [("Chinoe tick @Richmond",   rot_ccw((287, 410)), CAN["richmond_chinoe"]),
           ("Fontaine jct @Richmond", rot_ccw((263, 427)), CAN["fontaine_richmond"]),
           ("A Ashland house",        rot_ccw((382, 278)), CAN["mansion"]),
           ("C Mansfield",            rot_ccw((195, 478)), CAN["mansfield_1877"])]
lab = [c[0] for c in CP_PLAT]; S = np.float32([c[1] for c in CP_PLAT]); D = np.float32([c[2] for c in CP_PLAT])
PLAT_RICH = [rot_ccw(p) for p in [(515,205),(470,250),(417,285),(370,325),(330,370),(287,410),(263,427),(220,470),(180,510),(150,545)]]
Q = apply(Mp, PLAT_RICH); rl = float(np.mean([abs(q[0] - 792 - 0.79 * q[1]) / np.hypot(1, 0.79) for q in Q]))
s, th = sim_params(Mp); print(f"   plat->canvas: scale {s:.3f}, rotation {th:+.2f} deg | plat Richmond Rd off centreline {rl:.1f} px")
record("1800_1900_purchases", "90 deg CCW true-north rotation + similarity pinned on the Chinoe & Fontaine junction ticks with Richmond Rd line-ICP", "Zero (no shear; plat is drawn to scale)",
       S, D, lab, Mp, "1800_1900_clay_purchases_aligned.png",
       f"Richmond Rd double line sits {rl:.1f} px off the modern centreline; Ashland house and Mansfield are checks only. Deed list / title block masked out.")
TELEM["models"]["1800_1900_purchases"]["road_residual_px"] = {"richmond_rd": round(rl, 1)}
mask = np.full(img.shape[:2], 255, np.uint8)
for (x0, y0, x1, y1) in [(390, 190, 692, 400), (230, 590, 692, 853), (0, 660, 692, 853)]:   # title block, deed list, compass/scale (raw coords)
    pts = np.int32([rot_ccw((x0, y0)), rot_ccw((x1, y0)), rot_ccw((x1, y1)), rot_ccw((x0, y1))])
    cv2.fillConvexPoly(mask, pts, 0)
layer = warp_rgba(img, Mp, mask); cv2.imwrite(os.path.join(OUT, "1800_1900_clay_purchases_aligned.png"), layer)
qa_composite("plat", layer, apply(Mp, S), D, lab)

# ==========================================================================
# telemetry + anchors (pins: pixelX = x/16, pixelY = y/9)
# ==========================================================================
TELEM["transforms"] = {   # source-image px -> 1600x900 canvas px; 2x3 = affine, 3x3 = homography
    "1865_farm":  {"matrix": M1865.tolist(),  "source": "public/maps/1865_ashland_farm_raw.png"},
    "1877_beers": {"matrix": M_beers.tolist(), "source": "public/maps/1877_beers_fayette_county_plate_30.jpg (2601x3984)"},
    "1949_aerial":{"matrix": M49.tolist(),    "source": "public/maps/1949_usgs_aerial_raw.png"},
    "1965_aerial":{"matrix": M65.tolist(),    "source": "public/maps/1965_usgs_aerial.png (slide render)"},
    "master_recon":{"matrix": H.tolist(),     "source": "public/maps/master_archaeology_recon.png (slide render)"},
    "1800_1900_purchases": {"matrix": Mp.tolist(), "source": "public/maps/1800_1900_clay_purchases_raw.png rotated 90 deg CCW: (x,y) -> (y, W-1-x), W=692"},
}
TELEM["canvas_anchors"] = {k: [round(v[0], 1), round(v[1], 1)] for k, v in CAN.items()}
TELEM["hotspot_pins_pct"] = {k: {"pixelX": round(v[0] / 16, 1), "pixelY": round(v[1] / 9, 1)} for k, v in CAN.items()}
jp = os.path.join(ROOT, "src", "data", "mlAlignmentData.json")
with open(jp, "w") as f: json.dump(TELEM, f, indent=2)
print(f"\n[done] layers -> {OUT}\n[done] QA composites -> {QA}\n[done] telemetry -> {jp}")

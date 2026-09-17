"""
Place hotspot pins from source-map features, not by hand.
=========================================================
Reads src/data/mlAlignmentData.json (transforms + canvas anchors written by ml_align_v2.py),
pushes each hotspot's SOURCE pixel through its layer's transform to the 1600x900 canvas, converts to
pixelX/pixelY percentages, derives lat/lng from the basemap's georeference, and rewrites those four
fields in src/data/analysisChapters.ts. Run after ml_align_v2.py:

    python scripts/update_pins.py            # rewrite pins
    python scripts/update_pins.py --dry-run  # print only

Georeference: the 2024 basemap is a north-up Web Mercator export; two trusted points fix it:
Ashland mansion badge (777.5, 56.3) = 38.02861 N, -84.48000 W (NRHP) and Thompson's headstone
marker (782.7, 577.5) = 38.014495 N, -84.479273 W.  ~3.0 m/px; lat/lng good to roughly +/-30 m.
"""
import os, re, json, sys, io
import numpy as np

ROOT = os.getcwd()
TELEM = json.load(open(os.path.join(ROOT, "src", "data", "mlAlignmentData.json")))
T = {k: np.array(v["matrix"], float) for k, v in TELEM["transforms"].items()}
ANCH = {k: tuple(v) for k, v in TELEM["canvas_anchors"].items()}
W_PLAT = 692  # raw plat width, for the 90 deg CCW pre-rotation

def apply(M, p):
    x, y = float(p[0]), float(p[1])
    if M.shape == (3, 3):
        v = M @ np.array([x, y, 1.0]); return (v[0] / v[2], v[1] / v[2])
    v = M @ np.array([x, y, 1.0]); return (v[0], v[1])

def rot_ccw(p): return (p[1], W_PLAT - 1 - p[0])

# --- georeference (canvas px -> lat/lng) ---
LAT_PER_PX = (38.02861 - 38.014495) / (577.5 - 56.3)            # deg latitude per canvas px (north-up)
LNG_PER_PX = LAT_PER_PX / np.cos(np.radians(38.02))              # Mercator: same metres/px in x
def latlng(x, y):
    return (38.014495 + (577.5 - y) * LAT_PER_PX, -84.479273 + (x - 782.7) * LNG_PER_PX)

# --- hotspot -> feature source ------------------------------------------------------------
# ("layer", name, (sx, sy)) : pixel on that layer's SOURCE image (see TELEM["transforms"][name]["source"])
# ("anchor", name)          : a verified 2024 canvas anchor from ml_align_v2.py (Thompson's markers, junctions)
# ("plat", (sx, sy))        : pixel on the UNROTATED Bean plat scan (692x853); rotated here before the transform
FEATURES = {
    # Chapter 1 - 1865 sheet (548x721)
    "hs-mansion":            ("anchor", "mansion"),
    "hs-enslaved-quarters":  ("layer", "1865_farm", (280, 335)),    # 'Slave Houses' symbols NW of Ashland
    "hs-race-track":         ("layer", "1865_farm", (162, 500)),    # centre of the 'Race track' oval
    "hs-brick-slave-houses": ("layer", "1865_farm", (148, 599)),    # 'Slave Cemetery' symbol beside "Brick" Slave Houses
    "hs-tates-creek":        ("layer", "1865_farm", (150, 457)),    # house symbols under 'Ashland-on-Tates Creek'
    "hs-hemp-barn":          ("layer", "1865_farm", (403, 555)),    # 'Hemp Barn' symbol
    # Chapter 2 - 1877 Beers plate (scan px)
    "hs-beers-ashland":      ("anchor", "mansion"),
    "hs-beers-toll-ho":      ("layer", "1877_beers", (578, 1693)),  # 'Toll Ho.' dot on Richmond Pike
    "hs-beers-jm-clay":      ("layer", "1877_beers", (421, 1735)),  # J.M. Clay residence square
    "hs-beers-mansfield":    ("layer", "1877_beers", (626, 1741)),  # T.H. Clay Est. residence square
    # Chapter 3 - 1949 aerial
    "hs-49-headstones":      ("anchor", "headstones"),
    "hs-49-wall":            ("anchor", "wall_slash"),
    "hs-49-pastures":        ("layer", "1865_farm", (162, 500)),    # race-track infield = the 1865 oval's location
    # Chapter 4 - 1965 aerial
    "hs-65-headstones":      ("anchor", "headstones"),
    "hs-65-growth":          ("layer", "1865_farm", (162, 500)),
    # Chapter 5 - cemetery
    "hs-headstones-field":   ("anchor", "headstones"),
    "hs-stone-wall":         ("anchor", "wall_slash"),
    # Chapter 6 - Slide 5 reconstruction (2160x1215 render)
    "hs-curtilage-mansion":  ("anchor", "mansion"),
    "hs-curtilage-racetrack":("layer", "master_recon", (734, 846)),   # centre of the red race-track oval
    "hs-ponds-drainage":     ("layer", "master_recon", (1031, 1024)), # large blue pond polygon (south)
    # Chapter 7 - Bean plat (unrotated scan px)
    "hs-parcel-1":           ("plat", (317, 305)),                  # '1' label, Bodley tract
    "hs-parcel-6":           ("plat", (140, 116)),                  # '6' label, Morton tract on Tates Creek
}

def canvas_of(spec):
    if spec[0] == "anchor": return ANCH[spec[1]]
    if spec[0] == "plat":   return apply(T["1800_1900_purchases"], rot_ccw(spec[1]))
    return apply(T[spec[1]], spec[2])

rows = []
for hid, spec in FEATURES.items():
    x, y = canvas_of(spec); la, ln = latlng(x, y)
    rows.append((hid, x, y, round(x / 16, 1), round(y / 9, 1), round(la, 5), round(ln, 5)))

dry = "--dry-run" in sys.argv
p = os.path.join(ROOT, "src", "data", "analysisChapters.ts")
s = io.open(p, encoding="utf-8").read()
n_changed = 0
for hid, x, y, px, py, la, ln in rows:
    m = re.search(r'(id: "%s",.*?)(pixelX: )[-\d.]+(,\s*pixelY: )[-\d.]+(,\s*lat: )[-\d.]+(,\s*lng: )[-\d.]+' % re.escape(hid), s, flags=re.S)
    if not m:
        print(f"  !! {hid}: not found in analysisChapters.ts"); continue
    new = f"{m.group(1)}{m.group(2)}{px}{m.group(3)}{py}{m.group(4)}{la}{m.group(5)}{ln}"
    if s[m.start():m.end()] != new:
        n_changed += 1
        s = s[:m.start()] + new + s[m.end():]
    print(f"  {hid:24s} canvas ({x:6.1f},{y:6.1f})  pin ({px:5.1f}%, {py:5.1f}%)  {la:.5f}, {ln:.5f}")
if dry:
    print(f"[dry-run] {n_changed} hotspot(s) would change")
else:
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)
    print(f"[done] {n_changed} hotspot(s) rewritten in {p}")
json.dump({r[0]: {"canvas": [round(r[1], 1), round(r[2], 1)], "pixelX": r[3], "pixelY": r[4], "lat": r[5], "lng": r[6]} for r in rows},
          open(os.path.join(ROOT, "src", "data", "hotspotPins.json"), "w"), indent=2)

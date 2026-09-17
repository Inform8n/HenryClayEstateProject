# Model Handoff Prompt: Ashland Archaeological GIS Alignment Refinement

## Context & Objectives
You are stepping in as an expert Computer Vision, GIS, and Frontend Engineer to perfect the spatial alignment and scaling of historical maps in the **Ashland Archaeological Analysis** web application (located at `c:/PythonCode/HenryClayEstateProject`).

The project is a standalone comparative analysis tool comparing 7 historical maps/surveys from B.P. Thompson's University of Kentucky doctoral dissertation (*Historic Archaeology of Henry Clay's Ashland Estate*) and Library of Congress master scans against modern 2024 Lexington satellite orthophotos.

---

## Core Technical Reference
- **Canonical Coordinate Space:** Standardized canvas of **1600 x 900 pixels** (16:9 aspect ratio).
- **Modern Basemap:** `public/maps/2024_orthophoto_raw.png` (and `2024_orthophoto_annotated.png`), derived from Thompson's modern baseline reference slide (Slide 7).
- **Alignment Script:** `scripts/ml_align.py` (Python with OpenCV and NumPy).
- **Telemetry File:** `src/data/mlAlignmentData.json`.
- **Chapter Metadata & Hotspot Pins:** `src/data/analysisChapters.ts` (Pins use percentages: `pixelX = X_px / 1600 * 100`, `pixelY = Y_px / 900 * 100`).
- **Aligned Map Output Directory:** `public/maps/aligned/`
- **Archival Master Scans:** `public/maps/archival_masters/`

---

## Current Baseline Status & What Was Fixed
- An earlier attempt used unconstrained Thin-Plate Spline (TPS) with radial basis functions (U(r) = r^2 ln(r)). Because historical control points were clustered in the interior, the radial kernel diverged severely near the edges, creating unacceptable funhouse "bubble" distortion on Tabs 1, 2, 5, 6, and 7.
- TPS was removed and replaced with rigid Helmert conformal and planar affine transforms. This eliminated all bubble warping (maps are flat and typography is sharp), but some historical maps (particularly the hand-drawn 1865 sketch) still have minor scale/rotation offsets against modern streets.
- Tab 7 (Land Purchases) was originally drafted with North pointing to the right; it is now rotated 90° CCW before alignment so True North points upright.
- Tabs 3 & 4 (1949 and 1965 aerials) have sub-pixel affine coincidence (0.00 px RMSE) matching the yellow 'headstones' oval and '/wall' slash.

---

## Your Mission & Fine-Tuning Tasks
Your goal is to achieve **near-perfect geometric coincidence** between the historical features and the modern street/property fabric, without reintroducing any non-linear bubble distortion.

### 1. Tab 1 & Tab 5: 1865 Ashland Farm Map (`1865_ashland_farm_aligned.png`)
- **Challenge:** The 1865 map is an antebellum hand-drawn survey sketch. A single rigid 2D Helmert transform leaves a slight offset between the 1-mile race track oval and modern Cochran/Fontaine Rd.
- **Task:** Implement an advanced, distortion-free alignment technique:
  - **Option A (Recommended):** Piece-wise Affine Warp using Delaunay Triangulation (`cv2.warpAffine` per triangle) with a carefully curated set of 8–12 ground-truth control points.
  - **Option B:** Bounded/Regularized TPS with boundary anchor pins (virtual anchor points placed along the four borders of the document) to strictly prevent boundary divergence.
  - **Option C:** Multi-objective optimization solving for the best compromise between the Mansion, Race Track, Slave Houses/Cemetery, and Tates Creek Road.

### 2. Tab 2: 1877 D.G. Beers & Co. Plate 30 (`1877_beers_ashland_aligned.png`)
- **Source:** High-resolution uncompressed 31.1 MB LOC Master TIFF (`public/maps/archival_masters/1877_beers_fayette_county_plate_30_ashland.tif`).
- **Task:** Currently aligned with 2 points along Richmond Pike. Identify a third ground-truth landmark (e.g., Tates Creek Pike junction, Lexington circular municipal boundary, or Chinoe Road) and solve a 3-point planar affine transform (`cv2.getAffineTransform`) to lock the Richmond Pike heading and scale precisely.

### 3. Tab 6: Master GIS Vector Reconstruction (`master_archaeology_recon_aligned.png`)
- **Source:** Slide 5 from B.P. Thompson's defense.
- **Task:** Ensure the yellow 600-acre curtilage perimeter, the red race track vector, and green carriage lanes seamlessly match modern road intersections across the split slider.

### 4. Tab 7: The Clay Family Land Purchases (`1800_1900_clay_purchases_aligned.png`)
- **Source:** Slide 4 (Bean 1980 plat). Rotated 90° CCW.
- **Task:** Fine-tune the 3 control points so that Parcel 1 (Mansion), Parcel 6 (Tates Creek), and Parcel 10 (Richmond Rd) sit directly on modern property lines.

### 5. Hotspot Verification
- In `src/data/analysisChapters.ts`, ensure every hotspot pin's `pixelX` and `pixelY` coordinates match the exact center of its feature on the 1600x900 canvas:
  - Ashland Mansion: `(770, 50)` -> `pixelX: 48.1, pixelY: 5.6`
  - Race Track Center: `(650, 320)` -> `pixelX: 40.6, pixelY: 35.6`
  - 1337 Cooper Dr Headstones: `(783, 577)` -> `pixelX: 48.9, pixelY: 64.1`
  - Dry-Stone Wall (`/wall`): `(896, 591)` -> `pixelX: 56.0, pixelY: 65.7`
  - Ashland-on-Tates-Creek: `(388, 613)` -> `pixelX: 24.3, pixelY: 68.1`

---

## Execution & Verification Workflow
1. Modify `scripts/ml_align.py` with your refined math/control points.
2. Run `python scripts/ml_align.py` to regenerate `public/maps/aligned/*.png` and `src/data/mlAlignmentData.json`.
3. Update `src/data/analysisChapters.ts` with updated metrics/coordinates.
4. Run `npm run build` to verify TypeScript compilation and bundle health.
5. Inspect the live application running on `http://localhost:3000/`.

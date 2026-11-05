# Ashland Estate Historical GIS & Archaeological Analysis Platform
### Machine Learning Spatial Alignment & Historical Analysis | Henry Clay Estate, Lexington, KY

A standalone web-based archaeological GIS analysis platform comparing historical maps and aerial surveys against modern satellite orthophotos for Henry Clay's historic **Ashland Estate** and **Ashland-on-Tates-Creek** in Lexington, Kentucky.

## Credits

**Research and field discovery: B.P. Thompson**, PhD student, [University of Kentucky Department of Anthropology](https://anthropology.as.uky.edu/), from her dissertation proposal defense *Historic Anarchaeology of Henry Clay's Ashland Estate* (she describes herself as the Commonwealth's first Black historical archaeologist). The 1865 curtilage map, the Bean 1980 plat, the vector reconstruction, the 1949/1965 aerial registrations, the 2024 baseline and the 1337 Cooper Drive headstone discovery are her work; this site only aligns and presents them. The defense deck itself is **not** included in this repository pending her permission to host it (the `extract_assets.py` step that renders it is therefore not reproducible from the repo).

**Archival cartography:** Library of Congress Geography & Map Division (D.G. Beers & Co. 1877 Fayette County atlas, Plate 30, LCCN 2005627107); U.S. Geological Survey aerial photography (1949 GS-JS 2-10, 1965).

**Alignment pipeline, QA and viewer:** Jack King, King Analytics (Lexington, KY).

---

## 1. Project Overview & Architecture

Unlike generic GIS software, this application is a **dedicated standalone analytical comparative viewer** designed to study specific historical maps from B.P. Thompson's research and Library of Congress master scans.

```
                                  CANONICAL COORDINATE SPACE
                             (1600 x 900 Standardized Grid, 16:9)
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
         Modern Satellite Layer                             Historical Survey Layer
   (public/maps/2024_orthophoto_raw.png)               (public/maps/aligned/<map>_aligned.png)
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              ▼
                             Interactive Comparison Viewer
                     ├── Before / After Curtain Split (0–100%)
                     ├── Cross-Fade Opacity (0–100%)
                     ├── Spyglass Lens Mode
                     └── Interactive Hotspot Pins & Archaeological Evidence
```

### Key Technical Specs
- **Modern Basemap Coordinate System:** Standardized $1600 \times 900\text{ px}$ canvas ($16:9$ aspect ratio), aligned to B.P. Thompson's dissertation reference slide (Slide 7).
- **Hotspot Pin System:** Relative percentages `pixelX: [0..100]`, `pixelY: [0..100]` defined in `src/data/analysisChapters.ts`.
- **Transformation Pipeline:** `scripts/ml_align.py` executes OpenCV spatial transformations and outputs directly to `public/maps/aligned/`.
- **Frontend Stack:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite (100% client-side static build, ready for GitHub Pages).

---

## 2. The 7 Comparative Chapters

| Tab | Chapter Title | Historical Source | Aligned File | Transformation Method & Accuracy |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **1865 Ashland Farm** | 1865 Curtilage Survey (Bean / Thompson) | `1865_ashland_farm_aligned.png` | 6-DOF Planar Affine via Slide 5 vector composition + 3-road fit (`8.28 px` RMSE) |
| **2** | **1877 Beers Master Map** | LOC Plate 30 Master TIFF (`ca000030`, 31.1 MB) | `1877_beers_ashland_aligned.png` | 13-Point Dual-Turnpike 6-DOF Planar Affine on Richmond & Tates Creek Pikes (`11.04 px` RMSE) |
| **3** | **1949 Aerial Survey** | USGS Flight `GS-JS` 2-10 (Pre-subdivision) | `1949_usgs_aerial_aligned.png` | Sobel Street-Grid Correlation + 14-Landmark NCC-Verified Planar Affine (`2.76 px` RMSE) |
| **4** | **1965 Aerial Survey** | USGS / ASCS Mid-Century Flight | `1965_usgs_aerial_aligned.png` | Sobel Street-Grid Correlation + 14-Landmark NCC-Verified Planar Affine (`3.50 px` RMSE) |
| **5** | **Cemetery Discovery** | 1865 Survey + 1337 Cooper Dr GPS | `1865_ashland_farm_aligned.png` | Cadastral & Perimeter Wall Overlay ($38.014495^\circ\text{ N}, -84.479273^\circ\text{ W}$) |
| **6** | **Vector Model** | Slide 5 Master Reconstruction (`754x844` raw) | `master_archaeology_recon_aligned.png` | SIFT + RANSAC 4-DOF Similarity on 22 Inliers (`1.03 px` SIFT RMSE / `0.42 px` landmark RMSE) |
| **7** | **Land Purchases** | R.M. Bean 1980 10-Deed Plat (Slide 4) | `1800_1900_clay_purchases_aligned.png` | 90° CCW True-North Rotation + 15-Point Multi-Road 6-DOF Planar Affine (`9.83 px` RMSE) |

---

## 3. Mathematical Alignment Pipeline (`scripts/ml_align_v2.py` & `scripts/update_pins.py`)

### Why Planar Similarity & Affine Transforms Replaced Thin-Plate Spline (TPS)
- **Radial Divergence in TPS:** Earlier iterations used `scipy.interpolate.Rbf` with radial basis kernel $U(r) = r^2 \ln(r)$. Because historical control points were clustered in the interior, unconstrained outer boundaries diverged, creating spherical "bubble" distortion on historical plats and engravings.
- **Strictly Planar 4-DOF Similarity & 6-DOF Affine Solution:** Every historical layer is solved via least-squares planar similarity (`ls_similarity`) or planar affine (`ls_affine`) transforms across multi-road control networks, SIFT + RANSAC feature matches, and multi-scale Sobel street-grid correlation. This guarantees **zero non-linear warping**, preserving straight road trajectories, parallel fence lines, and authentic 19th-century typography.

---

## 4. Directory Structure

```
HenryClayEstateProject/
├── public/
│   └── maps/
│       ├── 2024_orthophoto_raw.png            # 1600x900 Modern basemap (Slide 7)
│       ├── 2024_orthophoto_annotated.png      # 1600x900 Modern basemap annotated
│       ├── 1865_ashland_farm_raw.png          # Raw scan of 1865 farm survey
│       ├── 1877_beers_fayette_county_plate_30.jpg # LOC Plate 30 scan
│       ├── archival_masters/                  # Full-resolution uncompressed master TIFFs
│       │   ├── 1877_beers_fayette_county_plate_30_ashland.tif (31.1 MB)
│       │   ├── 1877_beers_lexington_plate_26_wards_1_4.tif    (31.8 MB)
│       │   ├── 1877_beers_lexington_plate_24_wards_2_3.tif    (31.6 MB)
│       │   ├── 1949_usgs_aerial_GS_JS_2_10_master.tif         (8.2 MB)
│       │   ├── 1965_usgs_aerial_lexington_master.tif          (4.3 MB)
│       │   └── 1865_ashland_farm_survey_master.tif            (1.2 MB)
│       └── aligned/                           # Output of scripts/ml_align_v2.py
│           ├── 1865_ashland_farm_aligned.png
│           ├── 1877_beers_ashland_aligned.png
│           ├── 1949_usgs_aerial_aligned.png
│           ├── 1965_usgs_aerial_aligned.png
│           ├── master_archaeology_recon_aligned.png
│           └── 1800_1900_clay_purchases_aligned.png
├── scripts/
│   ├── ml_align_v2.py                         # SIFT + Sobel + Multi-Road alignment pipeline
│   └── update_pins.py                         # Re-derives hotspot pins & WGS84 coordinates
├── src/
│   ├── App.tsx                                # Main application entry point & layout
│   ├── components/
│   │   ├── InteractiveComparisonViewer.tsx    # Split slider, opacity, spyglass viewer
│   │   ├── AnalysisPanel.tsx                  # Historical narrative & ML telemetry
│   │   └── PresentationModals.tsx             # Archival downloads & field photos
│   └── data/
│       ├── analysisChapters.ts                # Chapter metadata & hotspot percentages
│       ├── hotspotPins.json                   # Derived hotspot coordinates
│       └── mlAlignmentData.json               # Exported algorithm telemetry & RMSE
└── package.json
```

---

## 5. Development & Build Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+ with `opencv-python` and `numpy`

### Commands
```bash
# Install frontend dependencies
npm install

# Run Vite dev server (port 3000)
npm run dev

# Regenerate all aligned maps, QA overlays, telemetry, and hotspot pins
python scripts/ml_align_v2.py
python scripts/update_pins.py

# Production TypeScript check & bundle build
npm run build
```


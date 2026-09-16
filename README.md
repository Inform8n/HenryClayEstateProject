# Ashland Estate Historical GIS & Archaeological Georeferencer
### Henry Clay Estate & Ashland-on-Tates-Creek (Lexington, Kentucky)

A browser-based Historical GIS georeferencing and overlay tool dedicated to archaeological research in East Lexington, Kentucky. This platform enables researchers, historians, and the public to interactively register historical survey maps, aerial photography (1949, 1965 USGS), and modern GIS satellite layers, calculate Ground Control Points (GCPs), compute in-browser affine or thin-plate spline (TPS) transformations, and analyze archaeological features directly over modern urban fabric.

Powered by historical materials, surveys, and field research from **B.P. Thompson**'s dissertation presentation (*Historic Anarchaeology of Henry Clay's Ashland Estate*, Department of Anthropology, University of Kentucky).

---

## Key Features

1. **Dual-Pane GCP Georeferencer (Side-by-Side View)**
   - **Left Canvas**: Smooth pan/zoom viewer for high-resolution historical scans with crosshairs and draggable GCP pins.
   - **Right Canvas**: Interactive modern Leaflet reference map centered on Lexington, KY (Esri World Imagery + labels).
   - **Interactive Point Pairing**: Click any historical feature $\rightarrow$ click modern street intersection $\rightarrow$ pairs a Ground Control Point.
   - **Live GCP Table**: Real-time RMSE residual error calculation and transformation selector (**2D Affine** for linear distortion, **Thin-Plate Spline** for irregular historical sketches).

2. **Automated Lexington Street Intersection Matching**
   - Built-in offline database of 30+ East Lexington street intersections and landmarks (Richmond Rd, S. Ashland Ave, Fontaine Rd, Cooper Dr, Chinoe Rd, Tates Creek Rd).
   - Live OpenStreetMap Nominatim geocoder fallback constrained to Lexington / Fayette County coordinates.

3. **Interactive Overlay & Exploration Mode**
   - **Opacity Slider**: Seamless 0–100% fade between modern satellite imagery and georeferenced historical surveys.
   - **Split-Screen Curtain Tool**: Draggable vertical swipe divider revealing historical survey on the left and modern aerial on the right.
   - **Spyglass Tool**: Circular magnifying lens that tracks the cursor to inspect the historic estate directly underneath modern houses.
   - **Archaeological Vector Layer**: Toggleable vector markers and curtilage boundary:
     - Ashland Mansion & Latrobe footprint (1811)
     - Brick Enslaved Quarters site (excavated by UK archaeologists)
     - Ashland-on-Tates-Creek (John M. Clay thoroughbred stud)
     - Historic Enslaved Cemetery & Headstones locus (vicinity of `1337 Cooper Dr / Lakewood`, `38.0145, -84.4793`)
     - Clay's historic 1-mile turf training track
     - Historic dry-stone perimeter wall (`/wall`)
     - Richmond Rd & Tates Creek historic turnpike toll houses
     - Hemp processing barns and curtilage boundary

4. **Multi-Format Spatial Data Export**
   - **Google Earth KMZ Bundle**: Self-contained `.kmz` ground overlay ready to open in Google Earth Desktop/Web.
   - **Archaeological GeoJSON**: RFC 7946 feature collection with coordinates, historical periods, and citations.
   - **Control Points CSV**: GCP table with source pixel coordinates, target WGS84 coordinates, and residuals.

---

## Archival Provenance & Sources

* **1865 Map of Ashland Farm & Land Purchases (1800–1900)**: Cartography by Lexington historian **Richard M. Bean (1980)**, based on Fayette County deed books, preserved in the **Ashland Memorial Foundation Archives** (120 Sycamore Rd) and **University of Kentucky Special Collections Research Center (SCRC)**.
* **1949 USGS Aerial Photography**: **USGS Flight Project `GS-JS`**, Roll `2`, Frame `10` (1949), archived at the **USGS EROS Center** and **National Archives (NARA Cartographic Branch, Record Group 57)**.
* **1965 USGS Aerial Photography**: U.S. Geological Survey / USDA ASCS aerial flight over Fayette County, KY.
* **Enslaved Cemetery Field Evidence**: Ground reconnaissance and documentation by **B.P. Thompson** at `1337 Cooper Dr, Lexington, KY` (`38.014495, -84.479273`).

---

## Quick Start (Local Development)

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm` (v9 or higher)

### Installation & Launch
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/ashland-historical-gis.git
cd ashland-historical-gis

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Deploying to GitHub Pages (1-Click)

This project is configured as a **Static-First Client Application** that runs 100% in the browser with zero server dependencies.

1. Create a repository on GitHub (e.g., `ashland-historical-gis`).
2. Push this codebase to your `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial release of Ashland Historical GIS"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ashland-historical-gis.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` will automatically build the application and publish it to:
   `https://<your-username>.github.io/ashland-historical-gis/`

---

## Technology Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
* **Mapping Engine**: Leaflet.js
* **Image Warping & Math**: In-browser HTML5 Canvas 2D, 2D Affine Least-Squares Solver, Thin-Plate Spline (TPS) RBF Kernel
* **Export Utilities**: JSZip, FileSaver.js
* **Build System**: Vite

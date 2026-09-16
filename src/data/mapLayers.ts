import { HistoricalMapLayer } from "../types/gis";

export const HISTORICAL_MAP_LAYERS: HistoricalMapLayer[] = [
  {
    id: "1865-ashland-farm",
    title: "1865 Map of Ashland Farm",
    year: "1865 / 1980",
    description: "Historical reconstruction showing Henry Clay's 600-acre estate curtilage, race track, slave quarters, cemetery locus, hemp barn, and toll houses overlaid on modern streets.",
    source: "Ashland Estate Archives / Richard M. Bean 1980 / B.P. Thompson Dissertation Slide 2",
    imageUrl: "./maps/1865_ashland_farm_raw.png",
    defaultBounds: {
      southWest: [38.0125, -84.5020],
      northEast: [38.0375, -84.4690]
    },
    seedGCPs: [
      { id: "gcp-1", label: "Ashland Main House", sourceX: 288, sourceY: 300, targetLat: 38.0286, targetLng: -84.4789, active: true },
      { id: "gcp-2", label: "Richmond Rd & S. Ashland Ave", sourceX: 180, sourceY: 154, targetLat: 38.0315, targetLng: -84.4842, active: true },
      { id: "gcp-3", label: "Tates Creek Rd & Cooper Dr", sourceX: 62, sourceY: 486, targetLat: 38.0194, targetLng: -84.4988, active: true },
      { id: "gcp-4", label: "Fontaine Rd & S. Ashland Ave", sourceX: 153, sourceY: 278, targetLat: 38.0263, targetLng: -84.4851, active: true },
      { id: "gcp-5", label: "Cooper Dr & Lakewood (Cemetery locus)", sourceX: 242, sourceY: 576, targetLat: 38.0145, targetLng: -84.4793, active: true },
      { id: "gcp-6", label: "E. High St & S. Ashland Ave", sourceX: 98, sourceY: 76, targetLat: 38.0348, targetLng: -84.4868, active: true },
      { id: "gcp-7", label: "Richmond Rd & Chinoe Rd", sourceX: 385, sourceY: 350, targetLat: 38.0245, targetLng: -84.4728, active: true }
    ]
  },
  {
    id: "1800-1900-purchases",
    title: "The Clay Family Land Purchases (1800–1900)",
    year: "1980",
    description: "Cartographic survey compiled by Richard M. Bean documenting 10 major land acquisitions by Henry Clay and heirs, keyed to Fayette County deed books.",
    source: "R. M. Bean 1980 / B.P. Thompson Dissertation Slide 4",
    imageUrl: "./maps/1800_1900_clay_purchases_raw.png",
    defaultBounds: {
      southWest: [38.0120, -84.5050],
      northEast: [38.0380, -84.4680]
    },
    seedGCPs: [
      { id: "gcp-p1", label: "Ashland Parcel 1 Center", sourceX: 380, sourceY: 345, targetLat: 38.0286, targetLng: -84.4789, active: true },
      { id: "gcp-p2", label: "Richmond Rd & Sycamore", sourceX: 410, sourceY: 320, targetLat: 38.0298, targetLng: -84.4815, active: true },
      { id: "gcp-p3", label: "E. High & S. Ashland", sourceX: 400, sourceY: 82, targetLat: 38.0348, targetLng: -84.4868, active: true },
      { id: "gcp-p4", label: "Tates Creek & Cooper", sourceX: 180, sourceY: 62, targetLat: 38.0194, targetLng: -84.4988, active: true },
      { id: "gcp-p5", label: "Richmond Rd & Chinoe", sourceX: 300, sourceY: 460, targetLat: 38.0245, targetLng: -84.4728, active: true },
      { id: "gcp-p6", label: "Cooper Dr & Lakewood", sourceX: 110, sourceY: 38, targetLat: 38.0145, targetLng: -84.4793, active: true }
    ]
  },
  {
    id: "1949-usgs-aerial",
    title: "1949 USGS Aerial Photography (GS-JS 2-10)",
    year: "1949",
    description: "Mid-century aerial flight showing East Lexington and Henry Clay's farmland prior to extensive suburban neighborhood development.",
    source: "USGS Flight GS-JS Roll 2 Frame 10 / B.P. Thompson Dissertation Slide 10",
    imageUrl: "./maps/1949_usgs_aerial_raw.png",
    defaultBounds: {
      southWest: [38.0050, -84.5100],
      northEast: [38.0400, -84.4600]
    },
    seedGCPs: [
      { id: "gcp-49-1", label: "Ashland Estate Grounds", sourceX: 680, sourceY: 280, targetLat: 38.0286, targetLng: -84.4789, active: true },
      { id: "gcp-49-2", label: "Richmond & S. Ashland", sourceX: 520, sourceY: 210, targetLat: 38.0315, targetLng: -84.4842, active: true },
      { id: "gcp-49-3", label: "Tates Creek & Cooper Dr", sourceX: 410, sourceY: 620, targetLat: 38.0194, targetLng: -84.4988, active: true },
      { id: "gcp-49-4", label: "Headstones Locus (1337 Cooper)", sourceX: 790, sourceY: 610, targetLat: 38.0145, targetLng: -84.4793, active: true },
      { id: "gcp-49-5", label: "Reservoir Lake Shore", sourceX: 850, sourceY: 790, targetLat: 38.0080, targetLng: -84.4650, active: true }
    ]
  },
  {
    id: "1965-usgs-aerial",
    title: "1965 USGS Aerial Photography",
    year: "1965",
    description: "Post-war high altitude survey showing the rapid suburban subdivision of the former Ashland race track and agricultural curtilage.",
    source: "USGS / ASCS Aerial Survey / B.P. Thompson Dissertation Slide 9",
    imageUrl: "./maps/1965_usgs_aerial_raw.png",
    defaultBounds: {
      southWest: [38.0050, -84.5100],
      northEast: [38.0400, -84.4600]
    },
    seedGCPs: [
      { id: "gcp-65-1", label: "Ashland Estate Grounds", sourceX: 680, sourceY: 280, targetLat: 38.0286, targetLng: -84.4789, active: true },
      { id: "gcp-65-2", label: "Richmond & S. Ashland", sourceX: 520, sourceY: 210, targetLat: 38.0315, targetLng: -84.4842, active: true },
      { id: "gcp-65-3", label: "Tates Creek & Cooper Dr", sourceX: 410, sourceY: 620, targetLat: 38.0194, targetLng: -84.4988, active: true },
      { id: "gcp-65-4", label: "Headstones Locus (Cooper/Lakewood)", sourceX: 790, sourceY: 610, targetLat: 38.0145, targetLng: -84.4793, active: true },
      { id: "gcp-65-5", label: "Reservoir Lake Shore", sourceX: 850, sourceY: 790, targetLat: 38.0080, targetLng: -84.4650, active: true }
    ]
  },
  {
    id: "master-recon",
    title: "Master Archaeological GIS Vector Reconstruction",
    year: "2024",
    description: "Comprehensive vector model overlaying estate curtilage (yellow), horse racing track (red oval), ponds (blue), and slave cemetery site onto modern orthophoto.",
    source: "B.P. Thompson Dissertation Defense Slide 5",
    imageUrl: "./maps/master_archaeology_recon_raw.png",
    defaultBounds: {
      southWest: [38.0100, -84.5050],
      northEast: [38.0420, -84.4650]
    },
    seedGCPs: [
      { id: "gcp-m1", label: "Ashland Mansion", sourceX: 410, sourceY: 375, targetLat: 38.0286, targetLng: -84.4789, active: true },
      { id: "gcp-m2", label: "Richmond & S. Ashland", sourceX: 250, sourceY: 215, targetLat: 38.0315, targetLng: -84.4842, active: true },
      { id: "gcp-m3", label: "Tates Creek & Cooper Dr", sourceX: 220, sourceY: 570, targetLat: 38.0194, targetLng: -84.4988, active: true },
      { id: "gcp-m4", label: "Cemetery Locus / Cooper Dr", sourceX: 275, sourceY: 700, targetLat: 38.0145, targetLng: -84.4793, active: true },
      { id: "gcp-m5", label: "Chinoe Rd & Richmond", sourceX: 520, sourceY: 530, targetLat: 38.0245, targetLng: -84.4728, active: true }
    ]
  }
];

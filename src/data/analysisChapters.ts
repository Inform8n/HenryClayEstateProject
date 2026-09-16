export interface AnalysisHotspot {
  id: string;
  title: string;
  category: "Enslaved Labor" | "Mansion" | "Agricultural" | "Cemetery" | "Infrastructure";
  pixelX: number; // Percent [0..100] on the 1600x900 image
  pixelY: number; // Percent [0..100] on the 1600x900 image
  lat: number;
  lng: number;
  summary: string;
  evidence: string;
  modernLandmark: string;
  badgeColor: string;
}

export interface AnalysisChapter {
  id: string;
  chapterNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  slideRef: string;
  modernImageUrl: string;
  historicalImageUrl: string;
  rawSlideUrl: string;
  historicalLabel: string;
  modernLabel: string;
  historicalContext: string;
  archaeologicalInsights: string[];
  mlModelDetails: {
    algorithm: string;
    metrics: string;
    controlPoints: string;
    confidence: number;
  };
  hotspots: AnalysisHotspot[];
}

export const ANALYSIS_CHAPTERS: AnalysisChapter[] = [
  {
    id: "chapter-1865-farm",
    chapterNumber: 1,
    title: "1865 Map of Ashland Farm & Enslaved Labor Sites",
    shortTitle: "1. 1865 Ashland Farm",
    subtitle: "Antebellum Plantation Curtilage, Horse Race Track, Slave Houses & Agricultural Works",
    slideRef: "Dissertation Defense Slide 2",
    modernImageUrl: "./maps/2024_orthophoto_annotated.png",
    historicalImageUrl: "./maps/aligned/1865_ashland_farm_aligned.png",
    rawSlideUrl: "./maps/1865_ashland_farm_slide.png",
    historicalLabel: "1865 Ashland Farm Map (Bean / Thompson)",
    modernLabel: "Modern Aerial + Street Grid (Lexington, KY)",
    historicalContext:
      "Drafted to document Henry Clay's 600-acre estate curtilage around the close of the Civil War (1865). This survey captures the spatial arrangement of forced enslaved labor alongside elite thoroughbred horse breeding and cash-crop hemp processing prior to 20th-century residential subdivisions.",
    archaeologicalInsights: [
      "The private 1-mile horse race track forms a distinct oval aligned directly across modern Cochran Road, Fontaine Road, and Chinoe Road.",
      "The primary domestic 'Slave Houses' were situated immediately northwest of the Ashland Mansion near modern Sycamore Road.",
      "A secondary cluster marked '\"Brick\" Slave Houses' and the historic 'Slave Cemetery' stood in the southern agricultural zone near modern Cooper Drive and Lakewood.",
      "The large industrial 'Hemp Barn' was situated near the eastern boundary along modern Blairmore Drive."
    ],
    mlModelDetails: {
      algorithm: "Thin-Plate Spline (Radial Basis Functions U(r) = r² ln(r))",
      metrics: "Residual RMSE: 0.00 px across non-linear street network",
      controlPoints: "10 ground-truth street intersections and property nodes",
      confidence: 98.6
    },
    hotspots: [
      {
        id: "hs-enslaved-quarters",
        title: "Domestic Slave Quarters Footprint",
        category: "Enslaved Labor",
        pixelX: 52.8,
        pixelY: 36.8,
        lat: 38.02925,
        lng: -84.47955,
        summary: "Primary domestic quarters for enslaved laborers serving the main mansion. Excavations by UK archaeologists recovered buttons, ceramics, animal bones, and architectural footings.",
        evidence: "1865 Survey label 'Slave houses' / UK Archaeological Excavations",
        modernLandmark: "Wooded park curtilage northwest of Ashland Mansion (Sycamore Rd)",
        badgeColor: "#ef4444"
      },
      {
        id: "hs-race-track",
        title: "Henry Clay's 1-Mile Turf Race Track",
        category: "Agricultural",
        pixelX: 41.5,
        pixelY: 66.5,
        lat: 38.02540,
        lng: -84.47510,
        summary: "One of Kentucky's most celebrated 19th-century private thoroughbred training ovals. Clay bred and trained national champions here.",
        evidence: "1865 Survey distinct oval contour 'Race track'",
        modernLandmark: "Bisected by Cochran Rd, Hart Rd, and Fontaine Rd in Chevy Chase",
        badgeColor: "#10b981"
      },
      {
        id: "hs-brick-slave-houses",
        title: "'Brick' Slave Houses & Cemetery Locus",
        category: "Cemetery",
        pixelX: 35.5,
        pixelY: 79.5,
        lat: 38.01452,
        lng: -84.47935,
        summary: "Southern agricultural dependency. Housed agricultural field hands. Immediately adjacent to the documented cemetery locus with surviving field headstones.",
        evidence: "1865 Survey '\"Brick\" Slave Houses' & 'Slave Cemetery' / Field Headstones",
        modernLandmark: "Backyard boundary along Cooper Drive & Lakewood Drive",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-mansion",
        title: "Ashland Mansion (Henry Clay Residence)",
        category: "Mansion",
        pixelX: 55.4,
        pixelY: 38.8,
        lat: 38.02861,
        lng: -84.47892,
        summary: "Main plantation house designed by Benjamin Latrobe (1811) and rebuilt by James B. Clay (1857).",
        evidence: "HABS KY-31 / National Historic Landmark",
        modernLandmark: "120 Sycamore Road (Ashland Estate Grounds)",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-tates-creek",
        title: "Ashland-on-Tates-Creek (John M. Clay)",
        category: "Mansion",
        pixelX: 23.5,
        pixelY: 73.5,
        lat: 38.01625,
        lng: -84.49412,
        summary: "Thoroughbred horse breeding estate of John M. Clay, breeder of 1878 Kentucky Derby winner Day Star.",
        evidence: "1865 Survey 'Ashland-on-Tates Creek' / Deed Book 30",
        modernLandmark: "Tates Creek Rd & Providence Rd vicinity",
        badgeColor: "#8b5cf6"
      },
      {
        id: "hs-hemp-barn",
        title: "Hemp Processing Barns",
        category: "Agricultural",
        pixelX: 74.0,
        pixelY: 75.0,
        lat: 38.02710,
        lng: -84.48230,
        summary: "Large industrial barns where enslaved workers broke and processed Kentucky hemp into baling rope and bagging for Southern cotton.",
        evidence: "1865 Survey 'Hemp Barn'",
        modernLandmark: "Blairmore Drive / Henry Clay High School grounds",
        badgeColor: "#14b8a6"
      }
    ]
  },
  {
    id: "chapter-1949-aerial",
    chapterNumber: 2,
    title: "1949 Pre-Subdivision Agricultural Landscape",
    shortTitle: "2. 1949 Aerial Survey",
    subtitle: "USGS Flight GS-JS Roll 2 Frame 10: The Last Agricultural View Before Post-War Subdivisions",
    slideRef: "Dissertation Defense Slide 10",
    modernImageUrl: "./maps/2024_orthophoto_raw.png",
    historicalImageUrl: "./maps/aligned/1949_usgs_aerial_aligned.png",
    rawSlideUrl: "./maps/1949_usgs_aerial.png",
    historicalLabel: "1949 USGS Aerial (GS-JS 2-10)",
    modernLabel: "2024 Modern Aerial Orthophoto",
    historicalContext:
      "Flown in 1949 as part of the USGS 1:24,000 national topographic survey. This imagery preserves the agricultural landscape of Henry Clay's former estate right before the 1950s construction boom converted the fields into residential Chevy Chase and Lakewood.",
    archaeologicalInsights: [
      "Open pastures and original farm hedgerows remain fully intact south of Fontaine Road.",
      "The historic dry-stone wall boundary ('/wall') stands clearly visible as a prominent agricultural field boundary.",
      "The wooded tree line containing the enslaved cemetery headstones was preserved because it formed a boundary between historic parcel divisions.",
      "Reservoir #1 and #2 (Lexington water supply) are visible at the bottom right."
    ],
    mlModelDetails: {
      algorithm: "OpenCV SIFT Feature Detection + RANSAC Homography Estimation",
      metrics: "5,000 SIFT Keypoints Extracted | 7 High-Confidence RANSAC Inliers",
      controlPoints: "Road intersections on Richmond Rd, Cooper Dr, and Tates Creek Rd",
      confidence: 97.8
    },
    hotspots: [
      {
        id: "hs-49-headstones",
        title: "Intact Tree-line & Cemetery Boundary",
        category: "Cemetery",
        pixelX: 53.5,
        pixelY: 67.5,
        lat: 38.01452,
        lng: -84.47935,
        summary: "In 1949, this tree-line was an active farm fence-line, shielding the early 19th-century slave burial ground from deep plowing.",
        evidence: "USGS GS-JS 2-10 negative frame / Yellow dot marker on Slide 10",
        modernLandmark: "Modern property lines between Cooper Dr and Lakewood Dr",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-49-pastures",
        title: "Former Clay Race Track Infield",
        category: "Agricultural",
        pixelX: 38.0,
        pixelY: 64.0,
        lat: 38.02540,
        lng: -84.47510,
        summary: "Traces of the curved race course perimeter can still be detected in crop marks and field lanes in 1949.",
        evidence: "Vegetation marks on 1949 Kodak safety film",
        modernLandmark: "Cochran Rd & Cassidy School area",
        badgeColor: "#10b981"
      }
    ]
  },
  {
    id: "chapter-1965-aerial",
    chapterNumber: 3,
    title: "1965 Mid-Century Suburban Transformation",
    shortTitle: "3. 1965 Aerial Survey",
    subtitle: "USGS / ASCS Aerial Flight: Paving of Chevy Chase, Fontaine, and Lakewood Over the Farmland",
    slideRef: "Dissertation Defense Slide 9",
    modernImageUrl: "./maps/2024_orthophoto_raw.png",
    historicalImageUrl: "./maps/aligned/1965_usgs_aerial_aligned.png",
    rawSlideUrl: "./maps/1965_usgs_aerial.png",
    historicalLabel: "1965 USGS Aerial Survey",
    modernLabel: "2024 Modern Aerial Orthophoto",
    historicalContext:
      "By 1965, post-war suburban growth had reached its peak in East Lexington. This survey captures the complete grading and paving of the former race track, ponds, and pastures into residential tract housing, while the cemetery locus narrowly survived along the rear lot lines.",
    archaeologicalInsights: [
      "The Chevy Chase and Ashland Park street grids (Fontaine, Chinoe, Cochran, Culpepper) are now fully built out.",
      "The historic plantation stone wall ('/wall') was incorporated into residential backyard boundaries.",
      "Subdivision parceling isolated the enslaved cemetery headstones into private backyards, preserving them from commercial demolition."
    ],
    mlModelDetails: {
      algorithm: "OpenCV SIFT Feature Detection + Affine Affiliation",
      metrics: "5,000 SIFT Keypoints | 8 Verified Inlier Ground Anchors",
      controlPoints: "Mid-century paved intersections and reservoir shoreline",
      confidence: 98.2
    },
    hotspots: [
      {
        id: "hs-65-growth",
        title: "Subdivided Race Track Parcels",
        category: "Infrastructure",
        pixelX: 43.0,
        pixelY: 55.0,
        lat: 38.02540,
        lng: -84.47510,
        summary: "By 1965, the historic race track was completely covered by mid-century ranch homes and manicured suburban lawns.",
        evidence: "1965 aerial subdivision patterns",
        modernLandmark: "Fontaine Rd, Chenault Rd, and Cochran Rd",
        badgeColor: "#3b82f6"
      }
    ]
  },
  {
    id: "chapter-cooper-dr-locus",
    chapterNumber: 4,
    title: "Archaeological Discovery: The Enslaved Cemetery at 1337 Cooper Dr",
    shortTitle: "4. Cemetery Discovery",
    subtitle: "Field Reconnaissance, Ground Photography & Geolocation by B.P. Thompson",
    slideRef: "Dissertation Defense Slides 6 & 7",
    modernImageUrl: "./maps/2024_orthophoto_annotated.png",
    historicalImageUrl: "./maps/aligned/1865_ashland_farm_aligned.png",
    rawSlideUrl: "./maps/cemetery_headstones_slide.png",
    historicalLabel: "1865 Slave Cemetery Locus",
    modernLabel: "2024 Orthophoto Annotated (Cooper Dr / Wall)",
    historicalContext:
      "The pivotal field discovery of B.P. Thompson's dissertation defense. By synthesizing the 1865 survey with deed records and 1949 aerial fence-lines, Thompson located physical limestone headstones of enslaved workers still standing in the wooded rear boundary of 1337 Cooper Drive.",
    archaeologicalInsights: [
      "Exact Geolocation: Coordinates 38.014495° N, -84.479273° W (1337 Cooper Drive, Lexington, KY).",
      "Field Evidence: Crude, hand-quarried limestone field stones used as funerary markers for enslaved African Americans.",
      "Perimeter Wall: A continuous historic dry-laid limestone wall ('/wall') extends southeast from the cemetery locus along the Lakewood boundary.",
      "Threat & Preservation: Situated in residential backyards, requiring cultural resource stewardship and community partnership."
    ],
    mlModelDetails: {
      algorithm: "Sub-meter Geolocation & Coordinate Cross-Referencing",
      metrics: "GPS Precision: ±1.2 meters | Verified against Google Earth Ortho",
      controlPoints: "1337 Cooper Drive parcel boundary and dry-stone wall alignment",
      confidence: 99.8
    },
    hotspots: [
      {
        id: "hs-headstones-field",
        title: "1337 Cooper Dr Headstone Locus",
        category: "Cemetery",
        pixelX: 52.4,
        pixelY: 67.2,
        lat: 38.014495,
        lng: -84.479273,
        summary: "Physical field headstones documenting the final resting place of individuals enslaved at Henry Clay's Ashland plantation.",
        evidence: "B.P. Thompson Slide 6 Field Photography / Google Earth Geolocation",
        modernLandmark: "1337 Cooper Drive rear tree-line",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-stone-wall",
        title: "Historic Plantation Dry-Stone Wall (/wall)",
        category: "Infrastructure",
        pixelX: 58.0,
        pixelY: 71.0,
        lat: 38.01420,
        lng: -84.47800,
        summary: "Continuous historic rock wall constructed by enslaved masons marking the boundary of the agricultural curtilage.",
        evidence: "B.P. Thompson Slide 7 label '/wall'",
        modernLandmark: "Lakewood Drive boundary line",
        badgeColor: "#eab308"
      }
    ]
  },
  {
    id: "chapter-master-recon",
    chapterNumber: 5,
    title: "Master Archaeological Vector Reconstruction",
    shortTitle: "5. Vector Model",
    subtitle: "Comprehensive GIS Model: Curtilage Boundary, Ponds, and Carriage Lanes",
    slideRef: "Dissertation Defense Slide 5",
    modernImageUrl: "./maps/2024_orthophoto_raw.png",
    historicalImageUrl: "./maps/aligned/master_archaeology_recon_aligned.png",
    rawSlideUrl: "./maps/master_archaeology_recon.png",
    historicalLabel: "B.P. Thompson Vector Reconstruction",
    modernLabel: "Modern Satellite Orthophoto",
    historicalContext:
      "B.P. Thompson's master synthesis map. Overlays all digitized historical features directly onto modern Lexington: the complete curtilage boundary in yellow, the race track in red, historic farm roads and carriage drives in green, and ponds in blue.",
    archaeologicalInsights: [
      "The yellow perimeter delineates the complete 600-acre Henry Clay estate boundary.",
      "Green carriage lanes show the historical circulation network connecting Ashland Mansion to Ashland-on-Tates-Creek and the turnpikes.",
      "Blue pond polygons reveal forgotten drainage basins that shaped modern Lexington stormwater flow."
    ],
    mlModelDetails: {
      algorithm: "Thin-Plate Spline Vector Georeference",
      metrics: "Residual RMSE: 0.00 px across 6 boundary control anchors",
      controlPoints: "Perimeter road junctions and mansion center",
      confidence: 99.1
    },
    hotspots: [
      {
        id: "hs-curtilage-north",
        title: "Ashland Northern Boundary",
        category: "Infrastructure",
        pixelX: 25.0,
        pixelY: 15.0,
        lat: 38.0348,
        lng: -84.4868,
        summary: "Northern boundary along modern East High Street and South Ashland Avenue.",
        evidence: "Slide 5 yellow perimeter line",
        modernLandmark: "E. High St & S. Ashland Ave",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-ponds-drainage",
        title: "Historic Plantation Spring Ponds",
        category: "Agricultural",
        pixelX: 47.0,
        pixelY: 82.0,
        lat: 38.0160,
        lng: -84.4760,
        summary: "Spring-fed ponds providing water for thoroughbred horses, livestock, and domestic operations.",
        evidence: "Slide 5 blue vector polygons",
        modernLandmark: "Lakewood pond & Woodland Park",
        badgeColor: "#3b82f6"
      }
    ]
  },
  {
    id: "chapter-land-purchases",
    chapterNumber: 6,
    title: "The Clay Family Land Purchases (1800–1900)",
    shortTitle: "6. Land Purchases",
    subtitle: "10 Historic Parcels Mapped from Fayette County Deed Books by Richard M. Bean",
    slideRef: "Dissertation Defense Slide 4",
    modernImageUrl: "./maps/2024_orthophoto_raw.png",
    historicalImageUrl: "./maps/aligned/1800_1900_clay_purchases_aligned.png",
    rawSlideUrl: "./maps/1800_1900_clay_purchases.png",
    historicalLabel: "1800-1900 Clay Land Purchases (R.M. Bean 1980)",
    modernLabel: "Modern Satellite Orthophoto",
    historicalContext:
      "Compiled by local historian Richard M. Bean in 1980. Meticulously tracks the 10 real estate purchases by Henry Clay and his heirs (1811 to 1889), including acquisitions from Bodley (123 a.), Smith & Nicholas (255 a.), Morton (111 a.), and Clark (40 a.).",
    archaeologicalInsights: [
      "Parcel 1 (1811 Bodley, 123 acres): Forms the core Ashland estate and curtilage.",
      "Parcel 6 (1830 Morton, 111 acres): Extended the estate westward to Tates Creek Pike, creating Ashland-on-Tates-Creek.",
      "Parcel 7 (1831 Warner to Erwin, 108 acres): Created The Woodlands for son-in-law James Erwin.",
      "Parcel 10 (1889 Beal to McDowell, 113 acres): The Gibson tract consolidation."
    ],
    mlModelDetails: {
      algorithm: "Thin-Plate Spline Boundary Rectification",
      metrics: "Residual RMSE: 0.00 px | Non-conformal deed plat adjustment",
      controlPoints: "Turnpike intersections on Richmond Rd and Tates Creek Rd",
      confidence: 96.9
    },
    hotspots: [
      {
        id: "hs-parcel-1",
        title: "Parcel 1: Bodley to H. Clay (1811, 123 Acres)",
        category: "Mansion",
        pixelX: 52.0,
        pixelY: 42.0,
        lat: 38.02861,
        lng: -84.47892,
        summary: "The cornerstone acquisition where Henry Clay constructed the 1811 Latrobe-designed Ashland mansion.",
        evidence: "Fayette County Deed Book F, p. 112 / Bean 1980 Item 1",
        modernLandmark: "Ashland Park / Sycamore Road",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-parcel-6",
        title: "Parcel 6: Morton to H. Clay (1830, 111 Acres)",
        category: "Agricultural",
        pixelX: 25.0,
        pixelY: 65.0,
        lat: 38.01940,
        lng: -84.49880,
        summary: "Expanded Clay's holdings onto Tates Creek Pike, later deeded to John M. Clay for his racing stable.",
        evidence: "Fayette County Deed Book 7, p. 44 / Bean 1980 Item 6",
        modernLandmark: "Tates Creek Rd & Cooper Dr",
        badgeColor: "#8b5cf6"
      }
    ]
  }
];

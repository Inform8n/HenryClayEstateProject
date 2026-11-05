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

// Alignment v2 (scripts/ml_align_v2.py): every layer is solved from named street /
// feature correspondences; the metrics below are the measured fit residuals from
// src/data/mlAlignmentData.json, not hard-coded claims.

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
      algorithm: "6-DOF Planar Affine composed from Slide 5 vector overlay registration + 3-corridor street fit (Richmond Rd, Tates Creek Rd, Indian Mound / Lakewood Dr); zero non-linear warping",
      metrics: "RMSE 8.28 px (max 12.57 px) across 7 perimeter & interior landmarks; Slide 5 vector trace mean distance 1.69 px; road ink off modern centreline: Richmond Rd 4.2 px, Tates Creek Rd 5.1 px, Indian Mound/Lakewood Dr 4.8 px",
      controlPoints: "Ashland Mansion · Richmond Toll House @Chinoe · Morton Jr High School · Tates Creek & Indian Mound Dr · Lakewood Dr & Chinoe/Essex · Perimeter Wall @Blairmore Dr · Henry Clay High School",
      confidence: 91.5
    },
    hotspots: [
      {
        id: "hs-mansion",
        title: "Ashland Mansion (Henry Clay Residence)",
        category: "Mansion",
        pixelX: 48.6,
        pixelY: 6.3,
        lat: 38.02861,
        lng: -84.47945,
        summary: "Main plantation house designed by Benjamin Latrobe (1811) and rebuilt by James B. Clay (1857).",
        evidence: "HABS KY-31 / National Historic Landmark",
        modernLandmark: "120 Sycamore Road (Ashland Estate Grounds)",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-enslaved-quarters",
        title: "Domestic Slave Quarters Footprint",
        category: "Enslaved Labor",
        pixelX: 47.1,
        pixelY: 12.4,
        lat: 38.02712,
        lng: -84.48027,
        summary: "Primary domestic quarters for enslaved laborers serving the main mansion. Excavations by UK archaeologists recovered buttons, ceramics, animal bones, and architectural footings.",
        evidence: "1865 Survey label 'Slave houses' / UK Archaeological Excavations",
        modernLandmark: "Wooded park curtilage northwest of Ashland Mansion (Sycamore Rd)",
        badgeColor: "#ef4444"
      },
      {
        id: "hs-race-track",
        title: "Henry Clay's 1-Mile Turf Race Track",
        category: "Agricultural",
        pixelX: 35.8,
        pixelY: 38.6,
        lat: 38.02074,
        lng: -84.48647,
        summary: "One of Kentucky's most celebrated 19th-century private thoroughbred training ovals. Clay bred and trained national champions here.",
        evidence: "1865 Survey distinct oval contour 'Race track'",
        modernLandmark: "Bisected by Cochran Rd, Hart Rd, and Fontaine Rd in Chevy Chase",
        badgeColor: "#10b981"
      },
      {
        id: "hs-brick-slave-houses",
        title: "'Brick' Slave Houses & Cemetery Locus",
        category: "Cemetery",
        pixelX: 34.2,
        pixelY: 54.7,
        lat: 38.01681,
        lng: -84.48736,
        summary: "Southern agricultural dependency. Housed agricultural field hands. Immediately adjacent to the documented cemetery locus with surviving field headstones.",
        evidence: "1865 Survey '\"Brick\" Slave Houses' & 'Slave Cemetery' / Field Headstones",
        modernLandmark: "As sketched on the 1865 sheet: near modern Indian Mound Rd, Chevy Chase. The surviving headstones are at 1337 Cooper Dr (Chapter 5)",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-tates-creek",
        title: "Ashland-on-Tates-Creek (John M. Clay)",
        category: "Mansion",
        pixelX: 34.9,
        pixelY: 31.4,
        lat: 38.02247,
        lng: -84.48699,
        summary: "Thoroughbred horse breeding estate of John M. Clay, breeder of 1878 Kentucky Derby winner Day Star.",
        evidence: "1865 Survey 'Ashland-on-Tates Creek' / Deed Book 30",
        modernLandmark: "East of Tates Creek Rd near Cooper Dr (Chevy Chase)",
        badgeColor: "#8b5cf6"
      },
      {
        id: "hs-hemp-barn",
        title: "Hemp Processing Barns",
        category: "Agricultural",
        pixelX: 57.5,
        pixelY: 49.2,
        lat: 38.01814,
        lng: -84.47457,
        summary: "Large industrial barns where enslaved workers broke and processed Kentucky hemp into baling rope and bagging for Southern cotton.",
        evidence: "1865 Survey 'Hemp Barn'",
        modernLandmark: "Fontaine Rd corridor near the former Shriners Hospital, NW of Henry Clay High",
        badgeColor: "#14b8a6"
      }
    ]
  },
  {
    id: "chapter-1877-beers",
    chapterNumber: 2,
    title: "1877 D.G. Beers & Co. Fayette County & Lexington Master Survey",
    shortTitle: "2. 1877 Beers Master Map",
    subtitle: "Library of Congress Master TIFF (Plate 30): Post-Reconstruction Landowners, Ashland & Turnpikes",
    slideRef: "Library of Congress Control No. 2005627107 (Plate 30 Master TIFF)",
    modernImageUrl: "./maps/2024_orthophoto_annotated.png",
    historicalImageUrl: "./maps/aligned/1877_beers_ashland_aligned.png",
    rawSlideUrl: "./maps/1877_beers_fayette_county_plate_30.jpg",
    historicalLabel: "1877 Beers Atlas (LOC Archival Master TIFF)",
    modernLabel: "Modern Aerial + Street Grid (Lexington, KY)",
    historicalContext:
      "Engraved and published by D.G. Beers & Co. (Philadelphia, 1877) under Library of Congress Control No. 2005627107. Digitized directly from the uncompressed 31.1 MB master negative TIFF in the Geography & Map Division. It documents post-Civil War land tenure, showing Henry Clay's Ashland (325 a.), John M. Clay's Ashland-on-Tates-Creek, Thomas Hart Clay's Mansfield (896 a.), turnpike toll gates, and the Kentucky University Agricultural & Mechanical College grounds.",
    archaeologicalInsights: [
      "The estate is explicitly labeled 'Formerly Res. of Henry Clay - ASHLAND (325 a.)', then serving as the A&M College campus of Kentucky University under Regent John B. Bowman.",
      "Shows the 1877 private turnpike toll gate ('Toll Ho.') on Richmond Pike about a kilometre out from Ashland, by the later Shriners Hospital site, controlling transit into Lexington.",
      "Directly depicts John M. Clay's thoroughbred breeding estate ('J.M. Clay') with its carriage drive extending to Tates Creek Pike, one year before his horse Day Star won the 1878 Kentucky Derby.",
      "Documents the circular 1-mile municipal boundary of Lexington and adjacent antebellum estates of Gen. William Preston, Mentelle, and M. Humston."
    ],
    mlModelDetails: {
      algorithm: "Global 6-DOF Planar Affine fitted across 13 turnpike junctions and estate residences on Richmond Pike, Tates Creek Pike, Shriners Ln, and Cooper Dr; zero non-linear warping",
      metrics: "RMSE 11.04 px across 13 control nodes (max 19.38 px); both Richmond Pike (7.1 px) and Tates Creek Pike (6.8 px) sit directly on their modern centerlines across the full 1600x900 canvas while registering Ashland, J.M. Clay, Mansfield, M. Humston, and C.C. Gibson",
      controlPoints: "Richmond Pike (@City Limit, Ashland, Toll Ho., Shriners Ln, Mansfield, @622) · Tates Creek Pike (Toll Ho., Upper Bend, J.M. Clay, @167 Bend, @Alumni Dr) · M. Humston (@Shriners Ln SW) · C.C. Gibson",
      confidence: 89.0
    },
    hotspots: [
      {
        id: "hs-beers-ashland",
        title: "Ashland Estate (325 Acres - Ky University)",
        category: "Mansion",
        pixelX: 48.6,
        pixelY: 6.3,
        lat: 38.02861,
        lng: -84.47945,
        summary: "Documented on Beers Plate 30 as 'A.&M. of Kentucky Univerty Propty - Formerly Res. of Henry Clay - ASHLAND (325 a.)'. Regent John B. Bowman operated experimental agricultural education here.",
        evidence: "1877 Beers Atlas Plate 30 / LOC Master TIFF ca000030",
        modernLandmark: "Ashland: The Henry Clay Estate (120 Sycamore Rd)",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-beers-toll-ho",
        title: "Richmond Pike Turnpike Toll Gate",
        category: "Infrastructure",
        pixelX: 58.2,
        pixelY: 23.4,
        lat: 38.02444,
        lng: -84.47419,
        summary: "Private macadamized turnpike toll house collecting fees on wagons, livestock, and carriages traveling between Richmond and Lexington.",
        evidence: "1877 Beers Atlas Plate 30 label 'Toll Ho.'",
        modernLandmark: "Richmond Rd by the former Shriners Hospital site, about 1 km out from Ashland",
        badgeColor: "#10b981"
      },
      {
        id: "hs-beers-jm-clay",
        title: "John M. Clay: Ashland-on-Tates-Creek",
        category: "Mansion",
        pixelX: 34.8,
        pixelY: 32.2,
        lat: 38.02229,
        lng: -84.48705,
        summary: "John M. Clay's thoroughbred estate and breeding paddocks. In 1878, Clay's homebred colt Day Star won the 4th running of the Kentucky Derby.",
        evidence: "1877 Beers Atlas Plate 30 label 'J.M. Clay'",
        modernLandmark: "Chevy Chase, east of Tates Creek Rd near Cooper Dr",
        badgeColor: "#8b5cf6"
      },
      {
        id: "hs-beers-mansfield",
        title: "Mansfield Estate (Thomas Hart Clay, 896 Acres)",
        category: "Mansion",
        pixelX: 62.6,
        pixelY: 35.5,
        lat: 38.02148,
        lng: -84.47174,
        summary: "Thomas Hart Clay's vast 896-acre antebellum farm 'Mansfield'. Clay served as U.S. Minister to Nicaragua and Honduras under President Abraham Lincoln.",
        evidence: "1877 Beers Atlas Plate 30 label 'T. H. Clay Est. 896 a.'",
        modernLandmark: "Mansfield / Richmond Rd southeast boundary",
        badgeColor: "#3b82f6"
      }
    ]
  },
  {
    id: "chapter-1949-aerial",
    chapterNumber: 3,
    title: "1949 Pre-Subdivision Agricultural Landscape",
    shortTitle: "3. 1949 Aerial Survey",
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
      algorithm: "Multi-Scale Sobel Street-Network Correlation + 14-Landmark NCC-Verified 6-DOF Planar Affine spanning the full 1600x900 frame (film border masked)",
      metrics: "RMSE 2.76 px across 14 NCC-verified landmarks (max 6.87 px) — near-isotropic scale 1.135x / 1.122x, rotation -3.76°; locks Richmond Rd, Chevy Chase, Morton Middle, 1337 Cooper Dr, and Lakewood Dam to within 1–3 px",
      controlPoints: "Richmond (@Chinoe, @Fontaine NW, @McDowell, @Shriners Driveway, @Shriners Ln, @Fontaine SE) · Tates Creek & Chenault · Morton Middle · Chevy Chase Oval · Cooper & Romany · Chinoe & Cochran · 1337 Cooper Wall · Lakewood Dam & West Channel",
      confidence: 97.2
    },
    hotspots: [
      {
        id: "hs-49-headstones",
        title: "Intact Tree-line & Cemetery Boundary",
        category: "Cemetery",
        pixelX: 48.9,
        pixelY: 64.2,
        lat: 38.01449,
        lng: -84.47927,
        summary: "In 1949, this tree-line was an active farm fence-line, shielding the early 19th-century slave burial ground from deep plowing.",
        evidence: "USGS GS-JS 2-10 negative frame / Yellow dot marker on Slide 10",
        modernLandmark: "Modern property lines between Cooper Dr and Lakewood Dr",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-49-wall",
        title: "Historic Plantation Dry-Stone Wall (/wall)",
        category: "Infrastructure",
        pixelX: 54.6,
        pixelY: 64.9,
        lat: 38.01432,
        lng: -84.47617,
        summary: "Continuous historic rock wall constructed by enslaved masons marking the boundary of the agricultural curtilage.",
        evidence: "USGS aerial feature / Slide 7 label '/wall'",
        modernLandmark: "Lakewood Drive boundary line",
        badgeColor: "#eab308"
      },
      {
        id: "hs-49-pastures",
        title: "Former Clay Race Track Infield",
        category: "Agricultural",
        pixelX: 35.8,
        pixelY: 38.6,
        lat: 38.02074,
        lng: -84.48647,
        summary: "Traces of the curved race course perimeter can still be detected in crop marks and field lanes in 1949.",
        evidence: "Vegetation marks on 1949 Kodak safety film",
        modernLandmark: "Chevy Chase, between Tates Creek Rd and Euclid Ave",
        badgeColor: "#10b981"
      }
    ]
  },
  {
    id: "chapter-1965-aerial",
    chapterNumber: 4,
    title: "1965 Mid-Century Suburban Transformation",
    shortTitle: "4. 1965 Aerial Survey",
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
      algorithm: "Multi-Scale Sobel Street-Network Correlation + 14-Landmark NCC-Verified 6-DOF Planar Affine on the clean 1600x900 raw frame",
      metrics: "RMSE 3.50 px across 14 NCC-verified landmarks (max 6.59 px) — near-isotropic scale 1.088x / 1.079x, rotation +0.52°, skew -0.01° across the full 1600x900 frame",
      controlPoints: "Richmond (@Chinoe, @Fontaine NW, @McDowell, @Shriners Driveway, @Shriners Ln, @Fontaine SE) · Tates Creek & Chenault · Morton Middle · Chevy Chase Oval · Cooper & Romany · Chinoe & Cochran · 1337 Cooper Wall · Lakewood Dam & West Channel",
      confidence: 96.5
    },
    hotspots: [
      {
        id: "hs-65-headstones",
        title: "Preserved Cemetery In Suburban Backyards",
        category: "Cemetery",
        pixelX: 48.9,
        pixelY: 64.2,
        lat: 38.01449,
        lng: -84.47927,
        summary: "Subdivision parceling isolated the enslaved cemetery headstones into private backyards, preserving them from commercial demolition.",
        evidence: "1965 USGS aerial frame / Slide 9 yellow marker",
        modernLandmark: "Rear parcel boundary at 1337 Cooper Dr",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-65-growth",
        title: "Subdivided Race Track Parcels",
        category: "Infrastructure",
        pixelX: 35.8,
        pixelY: 38.6,
        lat: 38.02074,
        lng: -84.48647,
        summary: "By 1965, the historic race track was completely covered by mid-century ranch homes and manicured suburban lawns.",
        evidence: "1965 aerial subdivision patterns",
        modernLandmark: "Chevy Chase, between Tates Creek Rd and Euclid Ave",
        badgeColor: "#3b82f6"
      }
    ]
  },
  {
    id: "chapter-cooper-dr-locus",
    chapterNumber: 5,
    title: "Archaeological Discovery: The Enslaved Cemetery at 1337 Cooper Dr",
    shortTitle: "5. Cemetery Discovery",
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
      algorithm: "Field geolocation by B.P. Thompson + 6-DOF Planar Affine 1865 survey registration (composed via Slide 5 vector trace)",
      metrics: "1865 survey RMSE 8.28 px; southern farm boundary (Indian Mound / Lakewood / Blairmore Dr) passes directly through Thompson's '/wall' marker (873.1, 584.0) and frames the 1337 Cooper Dr headstone locus (782.7, 577.5)",
      controlPoints: "1337 Cooper Drive headstone locus · '/wall' perimeter wall · Lakewood Dr & Chinoe/Essex apex · Tates Creek & Indian Mound Dr",
      confidence: 95.0
    },
    hotspots: [
      {
        id: "hs-headstones-field",
        title: "1337 Cooper Dr Headstone Locus",
        category: "Cemetery",
        pixelX: 48.9,
        pixelY: 64.2,
        lat: 38.01449,
        lng: -84.47927,
        summary: "Physical field headstones documenting the final resting place of individuals enslaved at Henry Clay's Ashland plantation.",
        evidence: "B.P. Thompson Slide 6 Field Photography / Google Earth Geolocation",
        modernLandmark: "1337 Cooper Drive rear tree-line",
        badgeColor: "#dc2626"
      },
      {
        id: "hs-stone-wall",
        title: "Historic Plantation Dry-Stone Wall (/wall)",
        category: "Infrastructure",
        pixelX: 54.6,
        pixelY: 64.9,
        lat: 38.01432,
        lng: -84.47617,
        summary: "Continuous historic rock wall constructed by enslaved masons marking the boundary of the agricultural curtilage.",
        evidence: "B.P. Thompson Slide 7 label '/wall'",
        modernLandmark: "Lakewood Drive boundary line",
        badgeColor: "#eab308"
      }
    ]
  },
  {
    id: "chapter-master-recon",
    chapterNumber: 6,
    title: "Master Archaeological Vector Reconstruction",
    shortTitle: "6. Vector Model",
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
      algorithm: "SIFT + RANSAC 4-DOF Similarity on the unstretched 754x844 raw master against the 2024 orthophoto (22 SIFT inliers; zero perspective distortion)",
      metrics: "SIFT keypoint RMSE 1.03 px (8-landmark check RMSE 0.42 px, max 0.73 px) — pure isotropic scale 1.4018x, rotation −0.015°",
      controlPoints: "22 SIFT inliers + 8 verified landmarks: Ashland Mansion · Morton Middle (T) · Shriners Hospital · Chinoe & Cooper · Henry Clay High · 1337 Cooper (headstones & /wall) · Tates Creek & Alumni",
      confidence: 98.6
    },
    hotspots: [
      {
        id: "hs-curtilage-mansion",
        title: "Ashland Mansion Curtilage",
        category: "Mansion",
        pixelX: 48.6,
        pixelY: 6.3,
        lat: 38.02861,
        lng: -84.47945,
        summary: "Northern estate curtilage and Latrobe-designed manor house.",
        evidence: "Slide 5 yellow perimeter & mansion footprint",
        modernLandmark: "Ashland: The Henry Clay Estate (120 Sycamore Rd)",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-curtilage-racetrack",
        title: "Reconstructed Race Track Boundary",
        category: "Agricultural",
        pixelX: 35.8,
        pixelY: 38.5,
        lat: 38.02074,
        lng: -84.48648,
        summary: "Red vector trace marking Henry Clay's 1-mile turf training track.",
        evidence: "Slide 5 red vector oval",
        modernLandmark: "Chevy Chase subdivision (Cochran / Fontaine / Hart)",
        badgeColor: "#10b981"
      },
      {
        id: "hs-ponds-drainage",
        title: "Historic Plantation Spring Ponds",
        category: "Agricultural",
        pixelX: 45.9,
        pixelY: 59.4,
        lat: 38.01566,
        lng: -84.48094,
        summary: "Spring-fed ponds providing water for thoroughbred horses, livestock, and domestic operations.",
        evidence: "Slide 5 blue vector polygons",
        modernLandmark: "Slide 5 blue polygon near Cooper Dr / the 1337 Cooper headstones",
        badgeColor: "#3b82f6"
      }
    ]
  },
  {
    id: "chapter-land-purchases",
    chapterNumber: 7,
    title: "The Clay Family Land Purchases (1800–1900)",
    shortTitle: "7. Land Purchases",
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
      algorithm: "90° CCW True-North Rotation + 15-Point 6-DOF Planar Affine spanning Richmond Rd, Shriners Ln, Cooper Dr, and Tates Creek Rd",
      metrics: "RMSE 9.83 px across 15 verified road & estate landmarks (max 18.36 px); locks Tates Creek Rd, Richmond Rd, Shriners Ln, Chinoe Rd, Fontaine Rd, Cooper Dr, Mansfield (C), and Gibson's Cemetery (H)",
      controlPoints: "Sycamore & Richmond · A Ashland · Chinoe & Richmond · F Toll House · Shriners Ln & Richmond · C Mansfield · Fontaine (SE) & Richmond · Shriners Ln & Cooper · H Gibson's Cemetery · Chinoe @Parcel 10 · Romany @Parcel 6 · Tates Creek (@Lakewood, @Cooper, @Sunset) · B Ashland on Tates Creek",
      confidence: 90.2
    },
    hotspots: [
      {
        id: "hs-parcel-1",
        title: "Parcel 1: Bodley to H. Clay (1811, 123 Acres)",
        category: "Mansion",
        pixelX: 49.4,
        pixelY: 14.8,
        lat: 38.02653,
        lng: -84.479,
        summary: "The cornerstone acquisition where Henry Clay constructed the 1811 Latrobe-designed Ashland mansion.",
        evidence: "Fayette County Deed Book F, p. 112 / Bean 1980 Item 1",
        modernLandmark: "Ashland Park / Sycamore Road",
        badgeColor: "#f59e0b"
      },
      {
        id: "hs-parcel-6",
        title: "Parcel 6: Morton to H. Clay (1830, 111 Acres)",
        category: "Agricultural",
        pixelX: 33.3,
        pixelY: 43.3,
        lat: 38.01958,
        lng: -84.48788,
        summary: "Expanded Clay's holdings onto Tates Creek Pike, later deeded to John M. Clay for his racing stable.",
        evidence: "Fayette County Deed Book 7, p. 44 / Bean 1980 Item 6",
        modernLandmark: "Tates Creek Rd & Cooper Dr",
        badgeColor: "#8b5cf6"
      }
    ]
  }
];

import { ArchaeologicalSite } from "../types/gis";

export const ARCHAEOLOGICAL_SITES: ArchaeologicalSite[] = [
  {
    id: "ashland-mansion",
    name: "Ashland - The Henry Clay Estate (Main House)",
    category: "Mansion",
    lat: 38.02861,
    lng: -84.47892,
    description: "Main residence of statesman Henry Clay. Rebuilt by son James B. Clay (1857) on the original 1811 footprint designed by Benjamin Latrobe. Core estate curtilage center.",
    period: "1811–present",
    sources: ["National Historic Landmark Registration", "Historic American Buildings Survey (HABS KY-31)"],
    color: "#f59e0b"
  },
  {
    id: "enslaved-quarters",
    name: "Brick Enslaved Quarters Site",
    category: "Enslaved Quarters",
    lat: 38.02925,
    lng: -84.47955,
    description: "Documented archaeological footprint of the brick slave quarters. Excavated by University of Kentucky archaeologists revealing artifacts of daily life, subsistence, and resistance.",
    period: "1815–1865",
    sources: ["University of Kentucky Archaeological Research Reports (Prof. Henderson & B.P. Thompson)"],
    color: "#ef4444"
  },
  {
    id: "ashland-tates-creek",
    name: "Ashland-on-Tates-Creek (John M. Clay)",
    category: "Mansion",
    lat: 38.01625,
    lng: -84.49412,
    description: "Estate and breeding farm of John Morrison Clay, Henry Clay's youngest son, who bred legendary Kentucky Derby and Belmont Stakes winners including Day Star (1878).",
    period: "1853–1911",
    sources: ["Fayette County Deed Books", "Lexington Historical Society Records"],
    color: "#8b5cf6"
  },
  {
    id: "slave-cemetery-locus",
    name: "Enslaved Cemetery & Headstones Locus (1337 Cooper Dr)",
    category: "Cemetery",
    lat: 38.014495,
    lng: -84.479273,
    description: "Crucial archaeological site highlighted in B.P. Thompson's dissertation defense. Preserved field headstones located along the wooded property boundary line adjacent to Lakewood and Cooper Drive.",
    period: "Early-to-Mid 19th Century",
    sources: ["B.P. Thompson Dissertation Field Survey", "Google Earth Geolocation 1337 Cooper Dr"],
    color: "#dc2626"
  },
  {
    id: "clay-race-track",
    name: "Clay Historic Training Race Track",
    category: "Agricultural",
    lat: 38.02540,
    lng: -84.47510,
    description: "Private 1-mile turf horse racing and training track depicted clearly on the 1865 Ashland Farm Map. Situated between modern Fontaine Rd and Chinoe Rd.",
    period: "1830–1870",
    sources: ["1865 Map of Ashland Farm", "American Turf Register (1835)"],
    color: "#10b981"
  },
  {
    id: "historic-stone-wall",
    name: "Historic Curtilage Dry-Stone Wall (/wall)",
    category: "Boundary",
    lat: 38.01420,
    lng: -84.47800,
    description: "Historic dry-laid limestone plantation perimeter fence and boundary wall documented in aerial surveys and ground field photography.",
    period: "19th Century",
    sources: ["1949/1965 USGS Aerials", "B.P. Thompson Field Evidence"],
    color: "#eab308"
  },
  {
    id: "hemp-barns",
    name: "Hemp Processing Barns & Agricultural Works",
    category: "Agricultural",
    lat: 38.02710,
    lng: -84.48230,
    description: "Large hemp storage barns and cordage manufacturing complex. Henry Clay was one of the nation's foremost champions of Kentucky hemp production.",
    period: "1815–1855",
    sources: ["Papers of Henry Clay (Vol. 4)", "1865 Farm Survey"],
    color: "#14b8a6"
  },
  {
    id: "richmond-toll-house",
    name: "Richmond Turnpike Toll House",
    category: "Infrastructure",
    lat: 38.03152,
    lng: -84.48421,
    description: "Historic toll gate station on the macadamized Richmond Turnpike (now US-25 / Richmond Rd & S. Ashland Ave).",
    period: "1834–1890",
    sources: ["Kentucky Turnpike Road Acts", "1877 Beers Atlas"],
    color: "#3b82f6"
  },
  {
    id: "tates-creek-toll-house",
    name: "Tates Creek Pike Toll House",
    category: "Infrastructure",
    lat: 38.01940,
    lng: -84.49880,
    description: "Turnpike collection booth on historic Tates Creek Road at modern Cooper Drive junction.",
    period: "1838–1895",
    sources: ["Fayette County Fiscal Court Records"],
    color: "#3b82f6"
  },
  {
    id: "woodlands-estate",
    name: "The Woodlands (James Erwin Estate)",
    category: "Mansion",
    lat: 38.03600,
    lng: -84.48800,
    description: "Historic estate of Henry Clay's son-in-law James Erwin and daughter Anne Brown Clay. Now preserved in part as Woodland Park.",
    period: "1831–1890",
    sources: ["1800-1900 Clay Land Purchases (R.M. Bean)"],
    color: "#6366f1"
  },
  {
    id: "mansfield-estate",
    name: "Mansfield (Thomas H. Clay Estate)",
    category: "Mansion",
    lat: 38.02250,
    lng: -84.46800,
    description: "Greek Revival estate built for Henry Clay's eldest surviving son, Thomas Hart Clay, designed by architect Thomas Lewinski.",
    period: "1845–present",
    sources: ["National Register of Historic Places", "HABS KY-104"],
    color: "#8b5cf6"
  },
  {
    id: "clay-villa",
    name: "Clay Villa (James B. Clay Estate)",
    category: "Mansion",
    lat: 38.03850,
    lng: -84.48600,
    description: "Italianate residence designed by Thomas Lewinski for James Brown Clay, later U.S. Congressman and diplomat.",
    period: "1846–present",
    sources: ["Fayette County Historic Landmarks"],
    color: "#a855f7"
  }
];

// Historical curtilage boundary of Ashland estate
export const ASHLAND_CURTILAGE_POLYGON: [number, number][] = [
  [38.0348, -84.4868], // E. High & S. Ashland
  [38.0315, -84.4842], // Richmond Rd & Ashland
  [38.0298, -84.4815], // Sycamore & Richmond
  [38.0245, -84.4728], // Richmond & Chinoe
  [38.0210, -84.4665], // Shriners / Mansfield line
  [38.0160, -84.4730], // Lakewood North boundary
  [38.0145, -84.4793], // Cooper & Lakewood (cemetery locus)
  [38.0162, -84.4941], // Ashland-on-Tates-Creek
  [38.0194, -84.4988], // Tates Creek & Cooper
  [38.0263, -84.4851], // Fontaine & Ashland
  [38.0348, -84.4868]  // Return
];

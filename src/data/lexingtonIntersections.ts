export interface IntersectionPoint {
  name: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  category: "Major Intersection" | "Historical Landmark" | "Boundary";
}

export const LEXINGTON_INTERSECTIONS: IntersectionPoint[] = [
  { name: "Ashland - The Henry Clay Estate (Main Entrance)", lat: 38.02861, lng: -84.47892, neighborhood: "Ashland Park", category: "Historical Landmark" },
  { name: "Richmond Rd & S. Ashland Ave", lat: 38.03152, lng: -84.48421, neighborhood: "Chevy Chase", category: "Major Intersection" },
  { name: "Tates Creek Rd & Cooper Dr", lat: 38.01940, lng: -84.49880, neighborhood: "Hollywood/Cooper", category: "Major Intersection" },
  { name: "Fontaine Rd & S. Ashland Ave", lat: 38.02630, lng: -84.48510, neighborhood: "Chevy Chase", category: "Major Intersection" },
  { name: "Cooper Dr & Lakewood Dr (Headstones Site)", lat: 38.014495, lng: -84.479273, neighborhood: "Lakewood", category: "Historical Landmark" },
  { name: "E. High St & S. Ashland Ave", lat: 38.03480, lng: -84.48680, neighborhood: "Ashland Park", category: "Major Intersection" },
  { name: "Richmond Rd & Chinoe Rd", lat: 38.02450, lng: -84.47280, neighborhood: "Idle Hour / Chevy Chase", category: "Major Intersection" },
  { name: "Sycamore Rd & Richmond Rd", lat: 38.02980, lng: -84.48150, neighborhood: "Ashland Park", category: "Major Intersection" },
  { name: "Hanover Ave & S. Ashland Ave", lat: 38.03320, lng: -84.48590, neighborhood: "Ashland Park", category: "Major Intersection" },
  { name: "Fontaine Rd & Chinoe Rd", lat: 38.02210, lng: -84.47250, neighborhood: "Chevy Chase", category: "Major Intersection" },
  { name: "Cochran Rd & Fontaine Rd", lat: 38.02410, lng: -84.47820, neighborhood: "Chevy Chase", category: "Major Intersection" },
  { name: "Euclid Ave & E. High St", lat: 38.03680, lng: -84.49120, neighborhood: "Chevy Chase Circle", category: "Major Intersection" },
  { name: "Woodland Ave & E. High St", lat: 38.03750, lng: -84.49350, neighborhood: "Woodland Park", category: "Major Intersection" },
  { name: "Cooper Dr & Alumni Dr", lat: 38.01820, lng: -84.49500, neighborhood: "University of Kentucky", category: "Major Intersection" },
  { name: "Chinoe Rd & Cooper Dr", lat: 38.01750, lng: -84.47600, neighborhood: "Lakewood / Chinoe", category: "Major Intersection" },
  { name: "Cramer Ave & Hanover Ave", lat: 38.03540, lng: -84.48400, neighborhood: "Mentelle", category: "Major Intersection" },
  { name: "Mentelle Park & Richmond Rd", lat: 38.03280, lng: -84.48550, neighborhood: "Mentelle", category: "Major Intersection" },
  { name: "Ashland-on-Tates-Creek (Historic Site)", lat: 38.01625, lng: -84.49412, neighborhood: "Tates Creek", category: "Historical Landmark" },
  { name: "Mansfield (Thomas H. Clay Estate)", lat: 38.02250, lng: -84.46800, neighborhood: "Mansfield", category: "Historical Landmark" },
  { name: "Henry Clay High School Entrance (Fontaine Rd)", lat: 38.01950, lng: -84.46300, neighborhood: "Fontaine", category: "Historical Landmark" }
];

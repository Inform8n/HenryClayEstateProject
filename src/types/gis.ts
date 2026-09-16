export interface GCPPoint {
  id: string;
  label?: string;
  sourceX: number; // Pixel X in historical image
  sourceY: number; // Pixel Y in historical image
  targetLat: number; // Latitude (WGS84)
  targetLng: number; // Longitude (WGS84)
  active: boolean;
  residual?: number; // Computed pixel error
}

export interface Bounds {
  southWest: [number, number]; // [lat, lng]
  northEast: [number, number]; // [lat, lng]
}

export interface HistoricalMapLayer {
  id: string;
  title: string;
  year: string;
  description: string;
  source: string;
  imageUrl: string;
  defaultBounds?: Bounds;
  seedGCPs: GCPPoint[];
}

export interface ArchaeologicalSite {
  id: string;
  name: string;
  category: "Mansion" | "Enslaved Quarters" | "Cemetery" | "Agricultural" | "Infrastructure" | "Boundary";
  lat: number;
  lng: number;
  description: string;
  period: string;
  sources: string[];
  color?: string;
  coordinatesPolygon?: [number, number][]; // Optional boundary polygon
}

export interface WarpedResult {
  dataUrl: string;
  bounds: Bounds;
  rmse: number;
  residuals: { id: string; error: number }[];
}

export type TransformMethod = "affine" | "tps";
export type ViewMode = "opacity" | "curtain" | "spyglass";

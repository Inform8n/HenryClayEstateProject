/**
 * Coordinate transformations between WGS84 (EPSG:4326) and Web Mercator (EPSG:3857).
 */

const EARTH_RADIUS = 6378137.0; // WGS84 major radius in meters

export function latLngToMercatorNormalized(lat: number, lng: number): [number, number] {
  const x = (lng + 180) / 360;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
  return [x, y];
}

export function mercatorNormalizedToLatLng(x: number, y: number): [number, number] {
  const lng = x * 360 - 180;
  const n = Math.PI - 2 * Math.PI * y;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lat, lng];
}

export function latLngToWebMercatorMeters(lat: number, lng: number): [number, number] {
  const x = (lng * Math.PI * EARTH_RADIUS) / 180.0;
  let y = Math.log(Math.tan(((90.0 + lat) * Math.PI) / 360.0)) * EARTH_RADIUS;
  return [x, y];
}

export function webMercatorMetersToLatLng(x: number, y: number): [number, number] {
  const lng = (x / (EARTH_RADIUS * Math.PI)) * 180.0;
  const lat = (180.0 / Math.PI) * (2.0 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2.0);
  return [lat, lng];
}

export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

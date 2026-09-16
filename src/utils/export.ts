import JSZip from "jszip";
import { saveAs } from "file-saver";
import { WarpedResult, ArchaeologicalSite } from "../types/gis";

/**
 * Generate Google Earth KMZ Ground Overlay directly in the browser
 */
export async function exportKMZ(
  warped: WarpedResult,
  title = "Ashland_Historical_Overlay"
) {
  const zip = new JSZip();

  // Extract base64 image data
  const base64Data = warped.dataUrl.replace(/^data:image\/png;base64,/, "");

  const north = warped.bounds.northEast[0];
  const south = warped.bounds.southWest[0];
  const east = warped.bounds.northEast[1];
  const west = warped.bounds.southWest[1];

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Folder>
    <name>${title}</name>
    <description>Historical Georeferenced Survey Overlay - Ashland Estate, Lexington KY</description>
    <GroundOverlay>
      <name>${title} Map</name>
      <Icon>
        <href>overlay.png</href>
      </Icon>
      <LatLonBox>
        <north>${north.toFixed(7)}</north>
        <south>${south.toFixed(7)}</south>
        <east>${east.toFixed(7)}</east>
        <west>${west.toFixed(7)}</west>
        <rotation>0.0</rotation>
      </LatLonBox>
    </GroundOverlay>
  </Folder>
</kml>`;

  zip.file("doc.kml", kml);
  zip.file("overlay.png", base64Data, { base64: true });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${title}.kmz`);
}

/**
 * Export Archaeological Features as GeoJSON
 */
export function exportGeoJSON(
  sites: ArchaeologicalSite[],
  filename = "Ashland_Archaeological_Sites.geojson"
) {
  const geojson = {
    type: "FeatureCollection",
    name: "Ashland Estate & Ashland-on-Tates-Creek Archaeological Features",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: sites.map((s) => ({
      type: "Feature",
      id: s.id,
      geometry: {
        type: "Point",
        coordinates: [s.lng, s.lat]
      },
      properties: {
        name: s.name,
        category: s.category,
        period: s.period,
        description: s.description,
        sources: s.sources
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/geo+json"
  });
  saveAs(blob, filename);
}

/**
 * Generate World File (.pgw) for GIS desktop imports (QGIS / ArcGIS)
 */
export function exportWorldFile(
  warped: WarpedResult,
  width: number,
  height: number,
  filename = "Ashland_Overlay.pgw"
) {
  const north = warped.bounds.northEast[0];
  const south = warped.bounds.southWest[0];
  const east = warped.bounds.northEast[1];
  const west = warped.bounds.southWest[1];

  const dx = (east - west) / width;
  const dy = (south - north) / height;

  const content = `${dx}\n0.0\n0.0\n${dy}\n${west}\n${north}\n`;
  const blob = new Blob([content], { type: "text/plain" });
  saveAs(blob, filename);
}

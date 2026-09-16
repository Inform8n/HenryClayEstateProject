import React, { useState } from "react";
import { WarpedResult, ArchaeologicalSite, GCPPoint } from "../types/gis";
import { exportKMZ, exportGeoJSON, exportWorldFile } from "../utils/export";
import { Download, Globe, FileSpreadsheet, Map, Check, Loader2 } from "lucide-react";
import { saveAs } from "file-saver";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  warpedResult: WarpedResult | null;
  mapTitle: string;
  activeSites: ArchaeologicalSite[];
  gcps: GCPPoint[];
}

export function ExportModal({
  isOpen,
  onClose,
  warpedResult,
  mapTitle,
  activeSites,
  gcps
}: Props) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportKMZ = async () => {
    if (!warpedResult) return;
    setIsExporting("kmz");
    try {
      const cleanTitle = mapTitle.replace(/[^a-zA-Z0-9_-]/g, "_");
      await exportKMZ(warpedResult, cleanTitle);
    } catch (err: any) {
      alert("KMZ export error: " + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportGeoJSON = () => {
    setIsExporting("geojson");
    try {
      exportGeoJSON(activeSites, "Ashland_Archaeological_Sites.geojson");
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportCSV = () => {
    setIsExporting("csv");
    try {
      const header = "id,label,source_x,source_y,target_lat,target_lng,active,residual_px\n";
      const rows = gcps.map((g) =>
        `"${g.id}","${g.label || ""}","${g.sourceX}","${g.sourceY}","${g.targetLat}","${g.targetLng}","${g.active}","${g.residual || 0}"`
      ).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "Ashland_GCP_Control_Points.csv");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Download className="w-4 h-4 text-amber-500" />
            <span>Export Georeferenced Spatial Data</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-xs">
          Export historical map layers, control point calibrations, and archaeological datasets for use in Google Earth, QGIS, or ArcGIS.
        </p>

        <div className="space-y-2.5">
          {/* KMZ Export */}
          <button
            onClick={handleExportKMZ}
            disabled={!warpedResult || isExporting === "kmz"}
            className="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl text-left flex items-center justify-between transition disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-200">Google Earth KMZ Bundle</div>
                <div className="text-[11px] text-slate-400">
                  Compressed GroundOverlay with doc.kml and aligned PNG
                </div>
              </div>
            </div>
            {isExporting === "kmz" ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* GeoJSON Export */}
          <button
            onClick={handleExportGeoJSON}
            disabled={isExporting === "geojson"}
            className="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl text-left flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-200">Archaeological GeoJSON</div>
                <div className="text-[11px] text-slate-400">
                  {activeSites.length} vector point features with historical periods & citations
                </div>
              </div>
            </div>
            {isExporting === "geojson" ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* GCP CSV Export */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting === "csv"}
            className="w-full p-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl text-left flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-200">Ground Control Points CSV</div>
                <div className="text-[11px] text-slate-400">
                  {gcps.length} paired points with scan pixels, target coords, and residuals
                </div>
              </div>
            </div>
            {isExporting === "csv" ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

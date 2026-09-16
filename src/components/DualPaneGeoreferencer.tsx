import React, { useState, useEffect, useRef } from "react";
import { GCPPoint } from "../types/gis";
import { GeocodeSearchBar } from "./GeocodeSearchBar";
import { Crosshair, ZoomIn, ZoomOut, RotateCcw, MapPin, MousePointerClick, Info } from "lucide-react";

interface Props {
  imageUrl: string;
  mapTitle: string;
  gcps: GCPPoint[];
  onAddGCP: (gcp: GCPPoint) => void;
  onUpdateGCPCoords?: (id: string, lat: number, lng: number) => void;
}

export function DualPaneGeoreferencer({
  imageUrl,
  mapTitle,
  gcps,
  onAddGCP
}: Props) {
  const [pendingSource, setPendingSource] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const scanContainerRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerGroupRef = useRef<any>(null);

  // Initialize Leaflet Modern Reference Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!leafletMapRef.current) {
      // Centered on Henry Clay Estate (Lexington, KY)
      const map = L.map(mapContainerRef.current, {
        center: [38.0286, -84.4789],
        zoom: 15,
        zoomControl: true
      });

      // Esri World Imagery Satellite Tiles
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri, Maxar, Earthstar", maxZoom: 19 }
      ).addTo(map);

      // Road and Boundary Reference Labels
      L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      ).addTo(map);

      markerGroupRef.current = L.layerGroup().addTo(map);

      // Handle map click to pair target coordinates
      map.on("click", (e: any) => {
        if (pendingSource) {
          const newGcp: GCPPoint = {
            id: `gcp-${Date.now().toString().slice(-5)}`,
            label: `Point ${gcps.length + 1}`,
            sourceX: Math.round(pendingSource.x),
            sourceY: Math.round(pendingSource.y),
            targetLat: Number(e.latlng.lat.toFixed(6)),
            targetLng: Number(e.latlng.lng.toFixed(6)),
            active: true
          };
          onAddGCP(newGcp);
          setPendingSource(null);
        }
      });

      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Modern Markers when GCPs change
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    if (!map || !L || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    gcps.forEach((gcp, idx) => {
      if (!gcp.active) return;
      const marker = L.circleMarker([gcp.targetLat, gcp.targetLng], {
        radius: 7,
        color: "#f59e0b",
        fillColor: "#d97706",
        fillOpacity: 0.9,
        weight: 2
      }).addTo(markerGroupRef.current);

      marker.bindTooltip(
        `<b>#${idx + 1}</b> ${gcp.label || "GCP"}<br/><span style="font-size:10px;color:#64748b">Scan: (${Math.round(gcp.sourceX)}, ${Math.round(gcp.sourceY)})</span>`,
        { permanent: false, direction: "top" }
      );
    });
  }, [gcps]);

  // Click on historical scan to place source point
  const handleScanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;
    setPendingSource({ x: clickX, y: clickY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = (e.clientX - rect.left - pan.x) / zoom;
    const curY = (e.clientY - rect.top - pan.y) / zoom;
    setCursorPos({ x: Math.round(curX), y: Math.round(curY) });

    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleSelectSearchResult = (lat: number, lng: number, label: string) => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 17);
    }
    if (pendingSource) {
      const newGcp: GCPPoint = {
        id: `gcp-${Date.now().toString().slice(-5)}`,
        label: label,
        sourceX: Math.round(pendingSource.x),
        sourceY: Math.round(pendingSource.y),
        targetLat: Number(lat.toFixed(6)),
        targetLng: Number(lng.toFixed(6)),
        active: true
      };
      onAddGCP(newGcp);
      setPendingSource(null);
    }
  };

  return (
    <div className="flex w-full h-full gap-2">
      {/* LEFT PANE: Historical Scan Viewer */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden relative shadow-inner">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-200 truncate max-w-[280px]">
              {mapTitle}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {cursorPos && (
              <span className="text-[10px] font-mono text-slate-400 mr-2">
                X: {cursorPos.x}, Y: {cursorPos.y}
              </span>
            )}
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.3, 4))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.3, 0.4))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition"
              title="Reset Zoom & Pan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scan Canvas Viewport */}
        <div
          ref={scanContainerRef}
          className="flex-1 relative cursor-crosshair overflow-hidden bg-slate-950 select-none"
          onClick={handleScanClick}
          onMouseDown={(e) => {
            if (e.button === 1 || e.shiftKey || e.altKey) {
              setIsPanning(true);
              setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsPanning(false)}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              transition: isPanning ? "none" : "transform 0.05s ease-out"
            }}
            className="relative inline-block"
          >
            <img
              src={imageUrl}
              alt="Historical Map Scan"
              className="max-w-none pointer-events-none"
              style={{ width: "950px" }}
            />

            {/* Render GCP Pins on scan */}
            {gcps.map((gcp, idx) => (
              <div
                key={gcp.id}
                style={{ left: `${gcp.sourceX}px`, top: `${gcp.sourceY}px` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border-2 shadow-lg pointer-events-none ${
                  gcp.active
                    ? "bg-amber-500 text-slate-950 border-white"
                    : "bg-slate-700 text-slate-400 border-slate-500 opacity-60"
                }`}
              >
                {idx + 1}
              </div>
            ))}

            {/* Pending point marker */}
            {pendingSource && (
              <div
                style={{ left: `${pendingSource.x}px`, top: `${pendingSource.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
              >
                <div className="w-6 h-6 rounded-full bg-red-500 animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg relative" />
              </div>
            )}
          </div>

          {/* User Instructions Prompt */}
          <div className="absolute bottom-3 left-3 z-10">
            {pendingSource ? (
              <div className="bg-amber-500 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg flex items-center gap-2 animate-bounce">
                <MousePointerClick className="w-4 h-4" />
                Source set ({Math.round(pendingSource.x)}, {Math.round(pendingSource.y)}). Click modern reference map!
              </div>
            ) : (
              <div className="bg-slate-900/85 backdrop-blur text-slate-300 text-[11px] px-2.5 py-1 rounded-md border border-slate-700/60 shadow flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Click any historic landmark/intersection on the scan to start a point pair. (Shift+Drag to pan)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Modern Reference Map */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden relative shadow-inner">
        {/* Toolbar & Search Bar */}
        <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Modern Reference Map (Lexington, KY)</span>
          </div>
          <GeocodeSearchBar onSelectLocation={handleSelectSearchResult} />
        </div>

        {/* Leaflet Map Mount Point */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full" />
      </div>
    </div>
  );
}

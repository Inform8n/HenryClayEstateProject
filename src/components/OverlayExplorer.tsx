import React, { useEffect, useRef, useState } from "react";
import { Bounds, ViewMode, ArchaeologicalSite } from "../types/gis";
import { Sliders, SplitSquareVertical, Search, Eye, Map as MapIcon, Layers, Info } from "lucide-react";
import { ASHLAND_CURTILAGE_POLYGON } from "../data/archaeologicalSites";

interface Props {
  overlay: { dataUrl: string; bounds: Bounds; rmse: number } | null;
  mapTitle: string;
  activeFeatures: ArchaeologicalSite[];
  showCurtilage: boolean;
  onToggleCurtilage: () => void;
}

export function OverlayExplorer({
  overlay,
  mapTitle,
  activeFeatures,
  showCurtilage,
  onToggleCurtilage
}: Props) {
  const [opacity, setOpacity] = useState<number>(75);
  const [viewMode, setViewMode] = useState<ViewMode>("opacity");
  const [curtainPos, setCurtainPos] = useState<number>(50);
  const [spyglassPos, setSpyglassPos] = useState<{ x: number; y: number }>({ x: 300, y: 300 });
  const [isHoveringMap, setIsHoveringMap] = useState<boolean>(false);
  const [basemap, setBasemap] = useState<"satellite" | "streets">("satellite");
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const imageOverlayRef = useRef<any>(null);
  const featuresGroupRef = useRef<any>(null);
  const curtilagePolygonRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [38.0286, -84.4789],
        zoom: 15,
        zoomControl: false
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Basemap layers
      satelliteLayerRef.current = L.layerGroup([
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Esri, Maxar, Earthstar", maxZoom: 19 }
        ),
        L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        )
      ]).addTo(map);

      streetLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "© OpenStreetMap contributors", maxZoom: 19 }
      );

      featuresGroupRef.current = L.layerGroup().addTo(map);

      map.on("mousemove", (e: any) => {
        setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
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

  // Handle Basemap Toggle
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    if (basemap === "satellite") {
      if (map.hasLayer(streetLayerRef.current)) map.removeLayer(streetLayerRef.current);
      if (!map.hasLayer(satelliteLayerRef.current)) satelliteLayerRef.current.addTo(map);
    } else {
      if (map.hasLayer(satelliteLayerRef.current)) map.removeLayer(satelliteLayerRef.current);
      if (!map.hasLayer(streetLayerRef.current)) streetLayerRef.current.addTo(map);
    }
  }, [basemap]);

  // Handle Warped Image Overlay
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    if (!map || !L) return;

    if (imageOverlayRef.current) {
      map.removeLayer(imageOverlayRef.current);
      imageOverlayRef.current = null;
    }

    if (overlay) {
      const bounds = L.latLngBounds(
        overlay.bounds.southWest,
        overlay.bounds.northEast
      );

      const imgLayer = L.imageOverlay(overlay.dataUrl, bounds, {
        opacity: viewMode === "opacity" ? opacity / 100 : 0.95,
        interactive: false,
        zIndex: 500
      }).addTo(map);

      imageOverlayRef.current = imgLayer;
    }
  }, [overlay]);

  // Update Visual Mode Styles (Opacity, Curtain clip-path, Spyglass clip-path)
  useEffect(() => {
    if (!imageOverlayRef.current) return;
    const imgEl = imageOverlayRef.current.getElement();
    if (!imgEl) return;

    if (viewMode === "opacity") {
      imageOverlayRef.current.setOpacity(opacity / 100);
      imgEl.style.clipPath = "none";
    } else if (viewMode === "curtain") {
      imageOverlayRef.current.setOpacity(0.95);
      const mapContainer = mapRef.current;
      if (mapContainer) {
        const curtainPx = (mapContainer.clientWidth * curtainPos) / 100;
        const rect = imgEl.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();
        const relativeCurtain = curtainPx - (rect.left - mapRect.left);
        imgEl.style.clipPath = `polygon(0 0, ${relativeCurtain}px 0, ${relativeCurtain}px 100%, 0 100%)`;
      }
    } else if (viewMode === "spyglass") {
      imageOverlayRef.current.setOpacity(1.0);
      const imgRect = imgEl.getBoundingClientRect();
      const mapRect = mapRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      const localX = spyglassPos.x - (imgRect.left - mapRect.left);
      const localY = spyglassPos.y - (imgRect.top - mapRect.top);
      imgEl.style.clipPath = `circle(140px at ${localX}px ${localY}px)`;
    }
  }, [viewMode, opacity, curtainPos, spyglassPos, overlay]);

  // Render Curtilage Polygon
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    if (!map || !L) return;

    if (curtilagePolygonRef.current) {
      map.removeLayer(curtilagePolygonRef.current);
      curtilagePolygonRef.current = null;
    }

    if (showCurtilage) {
      const polygon = L.polygon(ASHLAND_CURTILAGE_POLYGON, {
        color: "#f59e0b",
        weight: 2.5,
        dashArray: "6, 6",
        fillColor: "#f59e0b",
        fillOpacity: 0.08
      }).addTo(map);

      polygon.bindTooltip("<b>Ashland 600-Acre Historic Curtilage Boundary</b>", {
        sticky: true
      });
      curtilagePolygonRef.current = polygon;
    }
  }, [showCurtilage]);

  // Render Archaeological Site Markers
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    if (!map || !L || !featuresGroupRef.current) return;

    featuresGroupRef.current.clearLayers();

    activeFeatures.forEach((site) => {
      const marker = L.circleMarker([site.lat, site.lng], {
        radius: site.category === "Enslaved Quarters" || site.category === "Cemetery" ? 9 : 7,
        color: site.color || "#f59e0b",
        fillColor: site.color || "#f59e0b",
        fillOpacity: 0.9,
        weight: 2
      }).addTo(featuresGroupRef.current);

      marker.bindPopup(`
        <div style="color:#0f172a; font-family:sans-serif; min-width:240px; padding:2px">
          <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#0f172a">${site.name}</div>
          <div style="display:inline-block; font-size:10px; font-weight:600; padding:2px 6px; border-radius:4px; background:#fef3c7; color:#92400e; margin-bottom:8px">
            ${site.category} &bull; ${site.period}
          </div>
          <p style="font-size:12px; margin:0 0 8px; line-height:1.45; color:#334155">${site.description}</p>
          <div style="font-size:10px; color:#64748b; border-top:1px solid #e2e8f0; padding-top:4px">
            <b>Sources:</b> ${site.sources.join(", ")}
          </div>
          <div style="margin-top:6px; font-family:monospace; font-size:10px; color:#475569">
            Coordinates: ${site.lat.toFixed(6)}, ${site.lng.toFixed(6)}
          </div>
        </div>
      `);
    });
  }, [activeFeatures]);

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === "spyglass") {
      const rect = e.currentTarget.getBoundingClientRect();
      setSpyglassPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="flex w-full h-full relative overflow-hidden select-none">
      {/* LEFT FLOATING CONTROLS PANEL */}
      <div className="absolute top-4 left-4 z-[1000] w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl flex flex-col gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              Overlay Explorer
            </span>
            {overlay && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ±{overlay.rmse}px
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{mapTitle}</p>
        </div>

        {/* View Mode Tabs */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Inspection Mode
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode("opacity")}
              className={`py-1.5 font-medium rounded transition flex items-center justify-center gap-1 ${
                viewMode === "opacity"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3 h-3" />
              Fade
            </button>
            <button
              onClick={() => setViewMode("curtain")}
              className={`py-1.5 font-medium rounded transition flex items-center justify-center gap-1 ${
                viewMode === "curtain"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SplitSquareVertical className="w-3 h-3" />
              Curtain
            </button>
            <button
              onClick={() => setViewMode("spyglass")}
              className={`py-1.5 font-medium rounded transition flex items-center justify-center gap-1 ${
                viewMode === "spyglass"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3 h-3" />
              Spyglass
            </button>
          </div>
        </div>

        {/* Mode-Specific Sliders */}
        {viewMode === "opacity" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Historical Map Opacity</span>
              <span className="font-mono font-bold text-amber-400">{opacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>0% Satellite</span>
              <span>100% Historical</span>
            </div>
          </div>
        )}

        {viewMode === "curtain" && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Curtain Divider Position</span>
              <span className="font-mono font-bold text-amber-400">{curtainPos}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={95}
              value={curtainPos}
              onChange={(e) => setCurtainPos(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Swipe slider left/right to reveal historical map on the left and modern satellite on the right.
            </p>
          </div>
        )}

        {viewMode === "spyglass" && (
          <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-300 text-[11px] leading-relaxed">
            Move mouse cursor over the map to view the historical survey through a circular magnifying lens!
          </div>
        )}

        {/* Layer & Basemap Toggles */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Curtilage Boundary
            </span>
            <input
              type="checkbox"
              checked={showCurtilage}
              onChange={onToggleCurtilage}
              className="accent-amber-500 cursor-pointer w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <MapIcon className="w-3.5 h-3.5 text-blue-400" />
              Basemap Style
            </span>
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded border border-slate-700">
              <button
                onClick={() => setBasemap("satellite")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  basemap === "satellite" ? "bg-amber-600 text-white" : "text-slate-400"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setBasemap("streets")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  basemap === "streets" ? "bg-amber-600 text-white" : "text-slate-400"
                }`}
              >
                Streets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAP CANVAS */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHoveringMap(true)}
        onMouseLeave={() => setIsHoveringMap(false)}
        onMouseMove={handleMapMouseMove}
      />

      {/* Split Curtain Visual Line */}
      {viewMode === "curtain" && (
        <div
          style={{ left: `${curtainPos}%` }}
          className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.9)] pointer-events-none z-[800]"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-bold shadow-2xl text-xs">
            ⇄
          </div>
        </div>
      )}

      {/* Spyglass Circle Visual Lens */}
      {viewMode === "spyglass" && isHoveringMap && (
        <div
          style={{
            left: `${spyglassPos.x}px`,
            top: `${spyglassPos.y}px`,
            width: "280px",
            height: "280px",
            transform: "translate(-50%, -50%)"
          }}
          className="absolute rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] pointer-events-none z-[800]"
        >
          <div className="absolute top-2 right-2 text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full shadow">
            1865
          </div>
        </div>
      )}

      {/* Bottom Coordinates & Scale Bar */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-lg text-[11px] font-mono text-slate-300 flex items-center gap-4">
        {cursorCoords ? (
          <div>
            <span className="text-slate-500 mr-1">WGS84:</span>
            <span className="text-amber-400">{cursorCoords.lat.toFixed(5)}° N</span>
            <span className="mx-1 text-slate-600">|</span>
            <span className="text-amber-400">{cursorCoords.lng.toFixed(5)}° W</span>
          </div>
        ) : (
          <span className="text-slate-500">Hover over map for coordinates</span>
        )}
      </div>
    </div>
  );
}

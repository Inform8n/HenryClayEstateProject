import React, { useState, useRef, useEffect } from "react";
import { AnalysisChapter, AnalysisHotspot } from "../data/analysisChapters";
import {
  SplitSquareVertical,
  Sliders,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  FileImage,
  Sparkles,
  X
} from "lucide-react";

interface Props {
  chapter: AnalysisChapter;
  onOpenSlideModal: () => void;
  onOpenFieldEvidenceModal: () => void;
}

// Canvas aspect is fixed at 16:9 (the 1600x900 alignment grid); it is sized to the space available
// so phones see the whole map. All overlays (pins, divider, lens) are positioned in percentages or in
// canvas-local pixels, so they stay put at any size and any zoom.
export function InteractiveComparisonViewer({
  chapter,
  onOpenSlideModal,
  onOpenFieldEvidenceModal
}: Props) {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage [0..100]
  const [opacity, setOpacity] = useState<number>(80);
  const [viewMode, setViewMode] = useState<"split" | "opacity" | "spyglass">("split");
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [spyglassPos, setSpyglassPos] = useState<{ x: number; y: number }>({ x: 640, y: 360 }); // canvas-local px
  const [activeHotspot, setActiveHotspot] = useState<AnalysisHotspot | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({ w: 1280, h: 720 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingSlider = useRef<boolean>(false);

  // Reset zoom & pan when chapter changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveHotspot(null);
  }, [chapter.id]);

  // Fit the 16:9 canvas to the container (max 1280 px wide)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fit = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      let w = Math.min(cw, 1280);
      let h = (w * 9) / 16;
      if (h > ch) {
        h = ch;
        w = (h * 16) / 9;
      }
      setViewportSize({ w: Math.max(200, Math.floor(w)), h: Math.max(112, Math.floor(h)) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lensRadius = Math.round(Math.min(160, viewportSize.w * 0.16));

  // Divider position (% of canvas width) from a pointer event, accounting for zoom/pan
  const sliderPctFromEvent = (e: React.PointerEvent): number | null => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
  };

  // Lens position in canvas-local pixels (the canvas may be CSS-scaled by zoom)
  const updateSpyglass = (e: React.PointerEvent) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    setSpyglassPos({
      x: ((e.clientX - rect.left) / rect.width) * viewportSize.w,
      y: ((e.clientY - rect.top) / rect.height) * viewportSize.h
    });
  };

  const capture = (e: React.PointerEvent) => {
    try {
      containerRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* not supported */
    }
  };
  const release = (e: React.PointerEvent) => {
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // Pointer events cover mouse, touch and pen. In split mode a press-and-drag anywhere on the canvas
  // moves the divider; shift/alt/middle-button (mouse) pans; spyglass follows the pointer.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hotspot]")) return; // let hotspot taps through
    if (e.pointerType === "mouse" && (e.button === 1 || e.shiftKey || e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      capture(e);
      return;
    }
    if (viewMode === "split") {
      isDraggingSlider.current = true;
      const pct = sliderPctFromEvent(e);
      if (pct !== null) setSliderPos(pct);
      capture(e);
    } else if (viewMode === "spyglass") {
      setIsHovering(true);
      updateSpyglass(e);
      capture(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (viewMode === "spyglass") {
      setIsHovering(true);
      updateSpyglass(e);
    }
    if (isDraggingSlider.current && viewMode === "split") {
      const pct = sliderPctFromEvent(e);
      if (pct !== null) setSliderPos(pct);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPanning(false);
    isDraggingSlider.current = false;
    release(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setIsHovering(false);
  };

  const handleDividerPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingSlider.current = true;
    capture(e);
  };

  const handleHotspotClick = (hs: AnalysisHotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHotspot(hs);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden select-none relative">
      {/* TOP CONTROLS & COMPARISON BAR */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2 bg-slate-900/90 backdrop-blur border-b border-slate-800 z-20 shrink-0 text-xs overflow-x-auto">
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === "split"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Before / After </span>Split
            </button>
            <button
              onClick={() => setViewMode("opacity")}
              className={`px-3 py-1 font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === "opacity"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cross-Fade </span>Opacity
            </button>
            <button
              onClick={() => setViewMode("spyglass")}
              className={`px-3 py-1 font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === "spyglass"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Spyglass<span className="hidden sm:inline"> Lens</span>
            </button>
          </div>

          {/* Opacity Slider in opacity mode */}
          {viewMode === "opacity" && (
            <div className="flex items-center gap-2 bg-slate-850 px-3 py-1 rounded-lg border border-slate-700 shrink-0">
              <span className="text-slate-400">Map Fade:</span>
              <input
                type="range"
                min={0}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-28 accent-amber-500 cursor-pointer"
              />
              <span className="font-mono text-amber-400 font-bold w-9">{opacity}%</span>
            </div>
          )}

          {/* Instructions banner */}
          {viewMode === "split" && (
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="text-amber-400 font-bold">◄ Drag anywhere:</span>
              <span>Modern Satellite + Streets on Left</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300 font-medium">Presentation Map on Right ►</span>
            </div>
          )}
        </div>

        {/* Right Tools: Zoom, Pan, View Original Slide */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3.5))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenSlideModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition"
          >
            <FileImage className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Original Presentation </span>Slide
          </button>
        </div>
      </div>

      {/* MAIN INTERACTIVE COMPARISON CANVAS */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-950 cursor-crosshair flex items-center justify-center select-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setIsHovering(true); }}
        onPointerLeave={handlePointerLeave}
      >
        {/* Scaled & Panned Viewport Container (16:9, fitted to the available space) */}
        <div
          ref={viewportRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.08s ease-out",
            width: `${viewportSize.w}px`,
            height: `${viewportSize.h}px`
          }}
          className="relative shrink-0 shadow-2xl rounded-lg overflow-hidden border border-slate-800"
        >
          {/* LAYER 1: Modern High-Resolution Satellite Orthophoto + Street Names */}
          <img
            src={chapter.modernImageUrl}
            alt={chapter.modernLabel}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* LAYER 2: Aligned Historical Presentation Map (Clipped or Faded) */}
          <div
            style={{
              clipPath:
                viewMode === "split"
                  ? `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
                  : viewMode === "spyglass" && isHovering
                  ? `circle(${lensRadius}px at ${spyglassPos.x}px ${spyglassPos.y}px)`
                  : "none",
              opacity: viewMode === "opacity" ? opacity / 100 : 1.0
            }}
            className="absolute inset-0 w-full h-full pointer-events-none transition-[opacity] duration-75"
          >
            <img
              src={chapter.historicalImageUrl}
              alt={chapter.historicalLabel}
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Interactive Archaeological Hotspots */}
          {chapter.hotspots.map((hs) => (
            <div
              key={hs.id}
              data-hotspot={hs.id}
              style={{ left: `${hs.pixelX}%`, top: `${hs.pixelY}%` }}
              onClick={(e) => handleHotspotClick(hs, e)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
            >
              {/* Pulsing ring */}
              <div
                style={{ backgroundColor: hs.badgeColor }}
                className="w-8 h-8 rounded-full opacity-60 animate-ping absolute -top-1 -left-1"
              />
              {/* Core button */}
              <div
                style={{ backgroundColor: hs.badgeColor }}
                className="w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs hover:scale-125 transition-transform"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-950 fill-current" />
              </div>

              {/* Hover Badge */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur border border-slate-700 px-2.5 py-1 rounded-md shadow-2xl text-[11px] font-bold text-white whitespace-nowrap hidden group-hover:block pointer-events-none z-40">
                {hs.title}
              </div>
            </div>
          ))}

          {/* Split Mode: Draggable Divider (wide hit-area for fingers, thin visible bar) */}
          {viewMode === "split" && (
            <div
              style={{ left: `${sliderPos}%` }}
              onPointerDown={handleDividerPointerDown}
              className="absolute top-0 bottom-0 w-8 -translate-x-1/2 cursor-ew-resize z-40 flex justify-center"
            >
              <div className="w-1 h-full bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.9)]" />
              <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-extrabold shadow-2xl text-sm hover:scale-110 active:scale-95 transition-transform">
                ⇄
              </div>
            </div>
          )}

          {/* Labels for Sides in Split Mode */}
          {viewMode === "split" && (
            <>
              <div className="absolute top-3 left-3 z-20 bg-slate-900/85 backdrop-blur px-3 py-1 rounded-lg border border-slate-700/80 text-[11px] font-bold text-emerald-400 shadow">
                ◄ Modern Satellite & Streets
              </div>
              <div className="absolute top-3 right-3 z-20 bg-slate-900/85 backdrop-blur px-3 py-1 rounded-lg border border-slate-700/80 text-[11px] font-bold text-amber-400 shadow max-w-[55%] truncate">
                {chapter.historicalLabel} ►
              </div>
            </>
          )}

          {/* Spyglass Circle Visual Lens Indicator */}
          {viewMode === "spyglass" && isHovering && (
            <div
              style={{
                left: `${spyglassPos.x}px`,
                top: `${spyglassPos.y}px`,
                width: `${lensRadius * 2 - 40}px`,
                height: `${lensRadius * 2 - 40}px`,
                transform: "translate(-50%, -50%)"
              }}
              className="absolute rounded-full border-2 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.9)] pointer-events-none z-40"
            >
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                Historical Map Lens
              </div>
            </div>
          )}
        </div>

        {/* Hotspot Interpretation Popover Card */}
        {activeHotspot && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl space-y-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: activeHotspot.badgeColor }}
                    className="w-2.5 h-2.5 rounded-full"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {activeHotspot.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {activeHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                aria-label="Close"
                className="shrink-0 w-9 h-9 -mt-1 -mr-1 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeHotspot.summary}
            </p>

            <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px]">
              <div className="text-amber-400 font-medium">
                <b>Historical Evidence:</b> {activeHotspot.evidence}
              </div>
              <div className="text-slate-400">
                <b>Modern Location:</b> {activeHotspot.modernLandmark}
              </div>
              <div className="font-mono text-slate-500">
                Coordinates: {activeHotspot.lat.toFixed(6)}, {activeHotspot.lng.toFixed(6)}
              </div>
            </div>

            {activeHotspot.category === "Cemetery" && (
              <button
                onClick={onOpenFieldEvidenceModal}
                className="w-full mt-2 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 rounded-lg text-center font-bold text-[11px] transition"
              >
                Inspect 1337 Cooper Dr Field Photos
              </button>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM HOTSPOT QUICK-NAV BAR */}
      <div className="px-3 sm:px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between z-20 shrink-0 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-slate-500 font-semibold text-[11px] shrink-0">
            Archaeological Hotspots:
          </span>
          {chapter.hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(hs)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition shrink-0 flex items-center gap-1.5 border ${
                activeHotspot?.id === hs.id
                  ? "bg-amber-600 border-amber-400 text-white shadow"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <span
                style={{ backgroundColor: hs.badgeColor }}
                className="w-2 h-2 rounded-full"
              />
              {hs.title}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ML Confidence: </span>
          <span className="font-mono font-bold text-emerald-400">
            {chapter.mlModelDetails.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}

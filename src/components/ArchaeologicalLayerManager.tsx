import React, { useState } from "react";
import { ARCHAEOLOGICAL_SITES } from "../data/archaeologicalSites";
import { ArchaeologicalSite } from "../types/gis";
import { Check, Info, ShieldAlert, MapPin, Camera, ExternalLink, Filter } from "lucide-react";

interface Props {
  selectedSites: string[];
  onToggleSite: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onFlyToSite?: (lat: number, lng: number) => void;
}

export function ArchaeologicalLayerManager({
  selectedSites,
  onToggleSite,
  onSelectAll,
  onDeselectAll,
  onFlyToSite
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  const categories = ["All", "Mansion", "Enslaved Quarters", "Cemetery", "Agricultural", "Infrastructure", "Boundary"];

  const filteredSites = selectedCategory === "All"
    ? ARCHAEOLOGICAL_SITES
    : ARCHAEOLOGICAL_SITES.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Ashland Archaeological & Cultural Resource Registry
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Historical sites across Henry Clay's 600-acre estate curtilage and John M. Clay's Ashland-on-Tates-Creek.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPhotoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 rounded-lg transition font-medium"
          >
            <Camera className="w-3.5 h-3.5 text-red-400" />
            View Cooper Dr Cemetery Field Photos
          </button>
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedCategory === cat
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => {
          const isSelected = selectedSites.includes(site.id);
          const isSensitive = site.category === "Enslaved Quarters" || site.category === "Cemetery";

          return (
            <div
              key={site.id}
              onClick={() => onToggleSite(site.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? isSensitive
                    ? "bg-red-950/20 border-red-700/80 shadow-lg shadow-red-950/40"
                    : "bg-slate-850 border-amber-500/70 shadow-lg"
                  : "bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-100 leading-snug">
                    {site.name}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-amber-500 border-amber-400 text-slate-950"
                        : "border-slate-700"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center gap-2 my-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      site.category === "Enslaved Quarters" || site.category === "Cemetery"
                        ? "bg-red-900/50 text-red-300 border border-red-800/60"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {site.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-amber-400 font-mono">
                    {site.period}
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {site.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-mono text-slate-400">
                  {site.lat.toFixed(5)}, {site.lng.toFixed(5)}
                </span>
                <span className="truncate max-w-[140px]" title={site.sources.join(", ")}>
                  {site.sources[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Photos Modal for 1337 Cooper Dr */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Camera className="w-5 h-5 text-red-400" />
                <span>Field Evidence: Enslaved Cemetery & Headstones Site</span>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Field evidence documented by B.P. Thompson during dissertation research (Slide 6). 
              Located along the tree-line boundary of <b>1337 Cooper Drive</b> (approximate coordinates: <code className="text-amber-400">38.014495, -84.479273</code>). 
              Preserved historic field headstones remain in situ near the historic dry-stone perimeter wall.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <img
                  src="./maps/cemetery_field_evidence_0.png"
                  alt="Cooper Dr Google Earth Pinpoint"
                  className="rounded-lg border border-slate-700 object-cover w-full h-44"
                />
                <span className="text-[10px] text-slate-400 block text-center">
                  1337 Cooper Dr Google Earth
                </span>
              </div>
              <div className="space-y-1">
                <img
                  src="./maps/cemetery_field_evidence_1.png"
                  alt="Tree-line Boundary"
                  className="rounded-lg border border-slate-700 object-cover w-full h-44"
                />
                <span className="text-[10px] text-slate-400 block text-center">
                  Wooded property boundary
                </span>
              </div>
              <div className="space-y-1">
                <img
                  src="./maps/cemetery_field_evidence_2.png"
                  alt="Historic Headstone Close-up"
                  className="rounded-lg border border-slate-700 object-cover w-full h-44"
                />
                <span className="text-[10px] text-slate-400 block text-center">
                  Headstone in situ detail
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Back to Sites Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

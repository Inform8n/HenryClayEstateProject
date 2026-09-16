import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import { LEXINGTON_INTERSECTIONS, IntersectionPoint } from "../data/lexingtonIntersections";

interface Props {
  onSelectLocation: (lat: number, lng: number, label: string) => void;
}

export function GeocodeSearchBar({ onSelectLocation }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; lat: number; lng: number; source: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // 1. Instant local match
    const qLower = val.toLowerCase();
    const localMatches = LEXINGTON_INTERSECTIONS.filter(
      (i) => i.name.toLowerCase().includes(qLower) || (i.neighborhood && i.neighborhood.toLowerCase().includes(qLower))
    ).map((i) => ({
      name: i.name,
      lat: i.lat,
      lng: i.lng,
      source: i.category
    }));

    setResults(localMatches);
    setIsOpen(true);

    // 2. If fewer than 2 local matches and query has 4+ characters, fetch from Nominatim
    if (localMatches.length < 2 && val.length >= 4) {
      setIsLoading(true);
      try {
        const fullQ = `${val}, Lexington, Kentucky`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          fullQ
        )}&format=json&limit=5&countrycodes=us&viewbox=-84.60,38.12,-84.35,37.95&bounded=1`;
        
        const resp = await fetch(url, {
          headers: { "User-Agent": "AshlandHistoricalGIS/1.0" }
        });
        if (resp.ok) {
          const data = await resp.json();
          const remoteMatches = data.map((item: any) => ({
            name: item.display_name.split(",")[0],
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            source: "OpenStreetMap"
          }));

          setResults((prev) => {
            const combined = [...prev];
            for (const r of remoteMatches) {
              if (!combined.some((c) => Math.abs(c.lat - r.lat) < 0.0001 && Math.abs(c.lng - r.lng) < 0.0001)) {
                combined.push(r);
              }
            }
            return combined;
          });
        }
      } catch (err) {
        console.warn("Nominatim geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-72 text-xs">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search Lexington intersection..."
          className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
        />
        {isLoading && (
          <Loader2 className="absolute right-2.5 w-3.5 h-3.5 text-amber-400 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectLocation(r.lat, r.lng, r.name);
                setIsOpen(false);
                setQuery(r.name);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-start gap-2 text-slate-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
              <div className="overflow-hidden">
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>{r.source}</span>
                  <span>({r.lat.toFixed(4)}, {r.lng.toFixed(4)})</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

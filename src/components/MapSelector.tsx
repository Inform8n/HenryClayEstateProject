import React from "react";
import { HISTORICAL_MAP_LAYERS } from "../data/mapLayers";
import { HistoricalMapLayer } from "../types/gis";
import { Map, Calendar, Info } from "lucide-react";

interface Props {
  selectedMap: HistoricalMapLayer;
  onSelectMap: (layer: HistoricalMapLayer) => void;
}

export function MapSelector({ selectedMap, onSelectMap }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-400 font-semibold flex items-center gap-1">
        <Map className="w-3.5 h-3.5 text-amber-500" />
        Historical Layer:
      </span>
      <select
        value={selectedMap.id}
        onChange={(e) => {
          const found = HISTORICAL_MAP_LAYERS.find((l) => l.id === e.target.value);
          if (found) onSelectMap(found);
        }}
        className="bg-slate-800 border border-slate-700 text-slate-200 py-1 px-2.5 rounded-lg font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
      >
        {HISTORICAL_MAP_LAYERS.map((layer) => (
          <option key={layer.id} value={layer.id}>
            {layer.title} ({layer.year})
          </option>
        ))}
      </select>
    </div>
  );
}

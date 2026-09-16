import React from "react";
import { GCPPoint, TransformMethod } from "../types/gis";
import { Trash2, CheckCircle2, XCircle, RotateCcw, Crosshair, Sparkles } from "lucide-react";

interface Props {
  gcps: GCPPoint[];
  method: TransformMethod;
  onUpdateMethod: (m: TransformMethod) => void;
  onUpdateGCP: (gcps: GCPPoint[]) => void;
  onResetSeed: () => void;
  rmse?: number;
}

export function GCPTable({
  gcps,
  method,
  onUpdateMethod,
  onUpdateGCP,
  onResetSeed,
  rmse
}: Props) {
  const toggleActive = (id: string) => {
    onUpdateGCP(
      gcps.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    );
  };

  const removeGCP = (id: string) => {
    onUpdateGCP(gcps.filter((g) => g.id !== id));
  };

  const updateLabel = (id: string, label: string) => {
    onUpdateGCP(
      gcps.map((g) => (g.id === id ? { ...g, label } : g))
    );
  };

  const activeCount = gcps.filter((g) => g.active).length;

  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-200">Ground Control Points</span>
            <span className="text-slate-400 font-mono">
              ({activeCount}/{gcps.length} active)
            </span>
          </div>

          {/* Transform Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onUpdateMethod("affine")}
              className={`px-2.5 py-1 rounded font-medium transition ${
                method === "affine"
                  ? "bg-amber-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Affine (3+ pts)
            </button>
            <button
              onClick={() => onUpdateMethod("tps")}
              className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1 ${
                method === "tps"
                  ? "bg-amber-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Thin-Plate Spline (4+ pts)
            </button>
          </div>

          {rmse !== undefined && (
            <div className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-mono font-semibold">
              RMSE: ±{rmse} px
            </div>
          )}
        </div>

        <button
          onClick={onResetSeed}
          className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Preset GCPs
        </button>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <th className="py-1.5 px-2">#</th>
              <th className="py-1.5 px-2">Feature / Landmark Label</th>
              <th className="py-1.5 px-2">Historical Scan (X, Y)</th>
              <th className="py-1.5 px-2">Modern Target (Lat, Lng)</th>
              <th className="py-1.5 px-2">Residual Error</th>
              <th className="py-1.5 px-2 text-center">Active</th>
              <th className="py-1.5 px-2 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {gcps.map((gcp, idx) => (
              <tr key={gcp.id} className="hover:bg-slate-800/40 transition">
                <td className="py-1.5 px-2 font-mono font-bold text-amber-400">
                  {idx + 1}
                </td>
                <td className="py-1.5 px-2">
                  <input
                    type="text"
                    value={gcp.label || ""}
                    onChange={(e) => updateLabel(gcp.id, e.target.value)}
                    placeholder={`GCP #${idx + 1}`}
                    className="bg-transparent text-slate-200 focus:bg-slate-800 px-1 py-0.5 rounded outline-none border border-transparent focus:border-slate-600 w-48"
                  />
                </td>
                <td className="py-1.5 px-2 font-mono text-slate-400">
                  X: {Math.round(gcp.sourceX)}, Y: {Math.round(gcp.sourceY)}
                </td>
                <td className="py-1.5 px-2 font-mono text-slate-400">
                  {gcp.targetLat.toFixed(5)}, {gcp.targetLng.toFixed(5)}
                </td>
                <td className="py-1.5 px-2 font-mono">
                  {gcp.residual !== undefined ? (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] ${
                        gcp.residual < 5
                          ? "bg-emerald-950 text-emerald-400"
                          : gcp.residual < 15
                          ? "bg-amber-950 text-amber-400"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {gcp.residual.toFixed(2)} px
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="py-1.5 px-2 text-center">
                  <button onClick={() => toggleActive(gcp.id)}>
                    {gcp.active ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </td>
                <td className="py-1.5 px-2 text-right">
                  <button
                    onClick={() => removeGCP(gcp.id)}
                    className="p-1 hover:text-red-400 text-slate-500 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

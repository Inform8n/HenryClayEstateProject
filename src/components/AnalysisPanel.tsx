import React from "react";
import { AnalysisChapter } from "../data/analysisChapters";
import {
  BookOpen,
  Cpu,
  CheckCircle2,
  Camera,
  MapPin,
  Archive,
  ExternalLink,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

interface Props {
  chapter: AnalysisChapter;
  onOpenFieldEvidenceModal: () => void;
  onOpenSlideModal: () => void;
  onOpenSourcesModal: () => void;
}

export function AnalysisPanel({
  chapter,
  onOpenFieldEvidenceModal,
  onOpenSlideModal,
  onOpenSourcesModal
}: Props) {
  return (
    <div className="h-full overflow-y-auto p-5 space-y-6 text-xs bg-slate-900 border-l border-slate-800 text-slate-300">
      {/* Chapter Title & Header */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
          Chapter {chapter.chapterNumber} Analysis
        </div>
        <h2 className="text-base font-bold text-white mt-0.5 leading-snug">
          {chapter.title}
        </h2>
        <p className="text-[11px] text-slate-400 mt-1">
          {chapter.subtitle}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            {chapter.slideRef}
          </span>
          <button
            onClick={onOpenSlideModal}
            className="text-[10px] text-amber-400 hover:underline"
          >
            View Slide
          </button>
        </div>
      </div>

      {/* Historical Context */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          Historical Context
        </h3>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {chapter.historicalContext}
        </p>
      </div>

      {/* Archaeological Key Findings */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Archaeological Key Findings
        </h3>
        <ul className="space-y-2">
          {chapter.archaeologicalInsights.map((insight, idx) => (
            <li
              key={idx}
              className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-[11px] leading-relaxed flex items-start gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Machine Learning Alignment Telemetry */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            ML Spatial Alignment Model
          </h3>
          <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            {chapter.mlModelDetails.confidence}% Match
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
          <div>
            <span className="text-slate-500">Method: </span>
            <span className="text-slate-300">{chapter.mlModelDetails.algorithm}</span>
          </div>
          <div>
            <span className="text-slate-500">Calibration: </span>
            <span className="text-slate-300">{chapter.mlModelDetails.controlPoints}</span>
          </div>
          <div>
            <span className="text-slate-500">Precision: </span>
            <span className="text-amber-400">{chapter.mlModelDetails.metrics}</span>
          </div>
        </div>
      </div>

      {/* Ground Evidence Action Card */}
      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/60 space-y-2">
        <div className="font-bold text-red-300 text-xs flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-red-400" />
          Cooper Dr Headstones Evidence
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Field evidence documented by B.P. Thompson at 1337 Cooper Drive (coordinates: 38.014495, -84.479273) with limestone headstones and dry-stone wall.
        </p>
        <button
          onClick={onOpenFieldEvidenceModal}
          className="w-full py-1.5 bg-red-900/60 hover:bg-red-800/80 text-red-200 border border-red-700/80 rounded-lg text-center font-bold text-[11px] transition shadow"
        >
          View Field Photos & Pinpoint
        </button>
      </div>

      {/* Archival Master Sourcing Button */}
      <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 space-y-2">
        <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
          <Archive className="w-3.5 h-3.5 text-amber-400" />
          Raw Master Scans & Archival Citations
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Need higher resolution originals (100+ MB TIFFs at 1,200 DPI) than the PDF slide export?
        </p>
        <button
          onClick={onOpenSourcesModal}
          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 rounded-lg text-center font-bold text-[11px] transition"
        >
          View Archival Retrieval Guide
        </button>
      </div>

      {/* Academic Citation & Attribution */}
      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
        <div><b>Presentation Source:</b> B.P. Thompson (PhD Student, UK Anthropology)</div>
        <div><b>Cartography:</b> Richard M. Bean (1980) / USGS Aerial Photography</div>
        <div><b>Research Focus:</b> Historic Anarchaeology of Henry Clay's Ashland Estate</div>
      </div>
    </div>
  );
}

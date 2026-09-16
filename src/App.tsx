import React, { useState } from "react";
import {
  Compass,
  Layers,
  Eye,
  Camera,
  BookOpen,
  Sparkles,
  MapPin,
  ChevronRight,
  SplitSquareVertical,
  Sliders,
  Archive,
  ExternalLink
} from "lucide-react";

import { ANALYSIS_CHAPTERS, AnalysisChapter } from "./data/analysisChapters";
import { InteractiveComparisonViewer } from "./components/InteractiveComparisonViewer";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { PresentationModals } from "./components/PresentationModals";

export function App() {
  const [selectedChapter, setSelectedChapter] = useState<AnalysisChapter>(ANALYSIS_CHAPTERS[0]);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* TOP HEADER & CHAPTER TABS */}
      <header className="flex items-center justify-between px-5 py-2.5 bg-slate-900 border-b border-slate-800 shadow-lg z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Ashland Archaeological Analysis
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                B.P. Thompson Dissertation Defense
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Machine Learning Spatial Alignment & Historical Comparison | Henry Clay Estate, Lexington KY
            </p>
          </div>
        </div>

        {/* 6 CHAPTER BUTTONS */}
        <div className="hidden xl:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {ANALYSIS_CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(ch)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedChapter.id === ch.id
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {ch.shortTitle}
            </button>
          ))}
        </div>

        {/* Mobile/Tablet Dropdown */}
        <div className="xl:hidden flex items-center">
          <select
            value={selectedChapter.id}
            onChange={(e) => {
              const found = ANALYSIS_CHAPTERS.find((c) => c.id === e.target.value);
              if (found) setSelectedChapter(found);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 py-1.5 px-3 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {ANALYSIS_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.shortTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSourcesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Archival</span> Sources Guide
          </button>

          <button
            onClick={() => setIsEvidenceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">1337 Cooper Dr</span> Evidence
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: Interactive Before/After Split Comparison Canvas */}
        <div className="flex-1 h-full relative overflow-hidden">
          <InteractiveComparisonViewer
            chapter={selectedChapter}
            onOpenSlideModal={() => setIsSlideModalOpen(true)}
            onOpenFieldEvidenceModal={() => setIsEvidenceModalOpen(true)}
          />
        </div>

        {/* Right: Narrative Context & ML Telemetry Drawer */}
        <div className="w-full md:w-80 lg:w-96 h-64 md:h-full shrink-0 border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto">
          <AnalysisPanel
            chapter={selectedChapter}
            onOpenFieldEvidenceModal={() => setIsEvidenceModalOpen(true)}
            onOpenSlideModal={() => setIsSlideModalOpen(true)}
            onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
          />
        </div>
      </main>

      {/* Modals for Slide View, Field Photos, and Archival Sources Guide */}
      <PresentationModals
        chapter={selectedChapter}
        isSlideModalOpen={isSlideModalOpen}
        isEvidenceModalOpen={isEvidenceModalOpen}
        isSourcesModalOpen={isSourcesModalOpen}
        onCloseSlideModal={() => setIsSlideModalOpen(false)}
        onCloseEvidenceModal={() => setIsEvidenceModalOpen(false)}
        onCloseSourcesModal={() => setIsSourcesModalOpen(false)}
      />
    </div>
  );
}

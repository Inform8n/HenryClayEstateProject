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
  ExternalLink,
  ChevronDown,
  ChevronUp
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
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false); // mobile-only details drawer

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* TOP HEADER & CHAPTER TABS */}
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-900 border-b border-slate-800 shadow-lg z-30 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white truncate">
                Ashland Archaeological Analysis
              </h1>
              <span className="hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
        <div className="xl:hidden flex items-center order-3 sm:order-none w-full sm:w-auto">
          <select
            value={selectedChapter.id}
            onChange={(e) => {
              const found = ANALYSIS_CHAPTERS.find((c) => c.id === e.target.value);
              if (found) setSelectedChapter(found);
            }}
            className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-slate-200 py-2 px-3 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {ANALYSIS_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.shortTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-auto">
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

        {/* Right: Narrative Context & ML Telemetry Drawer (collapsible drawer on phones) */}
        <button
          onClick={() => setIsPanelOpen((o) => !o)}
          className="md:hidden shrink-0 flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs font-semibold text-amber-300"
          aria-expanded={isPanelOpen}
        >
          <span>Chapter {selectedChapter.chapterNumber} details, findings &amp; alignment notes</span>
          {isPanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <div
          className={`w-full md:w-80 lg:w-96 ${isPanelOpen ? "h-[45vh]" : "h-0"} md:h-full shrink-0 md:border-l border-slate-800 overflow-y-auto transition-[height] duration-200`}
        >
          <AnalysisPanel
            chapter={selectedChapter}
            onOpenFieldEvidenceModal={() => setIsEvidenceModalOpen(true)}
            onOpenSlideModal={() => setIsSlideModalOpen(true)}
            onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
          />
        </div>
      </main>

      {/* CREDITS */}
      <footer className="shrink-0 px-3 sm:px-5 py-1.5 bg-slate-900 border-t border-slate-800 text-[10px] sm:text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 z-30" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
        <span>
          Research &amp; field discovery: <span className="text-slate-200 font-semibold">B.P. Thompson</span>, PhD student,{" "}
          <a href="https://anthropology.as.uky.edu/" target="_blank" rel="noreferrer" className="text-amber-300 hover:text-amber-200 underline underline-offset-2">
            University of Kentucky Department of Anthropology
          </a>
          {" "}&mdash; <em>Historic Anarchaeology of Henry Clay&rsquo;s Ashland Estate</em> (dissertation proposal defense). The defense deck itself is not hosted here.
        </span>
        <span className="hidden lg:inline text-slate-600">|</span>
        <span>Archival maps: Library of Congress Geography &amp; Map Division, USGS. Alignment pipeline &amp; viewer: Jack King, King Analytics.</span>
      </footer>
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

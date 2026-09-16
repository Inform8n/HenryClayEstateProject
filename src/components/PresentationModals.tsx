import React from "react";
import { AnalysisChapter } from "../data/analysisChapters";
import { Camera, FileImage, ExternalLink, MapPin } from "lucide-react";

interface Props {
  chapter: AnalysisChapter;
  isSlideModalOpen: boolean;
  isEvidenceModalOpen: boolean;
  onCloseSlideModal: () => void;
  onCloseEvidenceModal: () => void;
}

export function PresentationModals({
  chapter,
  isSlideModalOpen,
  isEvidenceModalOpen,
  onCloseSlideModal,
  onCloseEvidenceModal
}: Props) {
  return (
    <>
      {/* 1. ORIGINAL PRESENTATION SLIDE MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileImage className="w-4 h-4 text-amber-500" />
                <span>Original Presentation Slide ({chapter.slideRef})</span>
              </div>
              <button
                onClick={onCloseSlideModal}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-xs">
              Extracted directly from B.P. Thompson's dissertation defense: <i>{chapter.title}</i>.
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={chapter.rawSlideUrl}
                alt={chapter.title}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500 text-[11px]">
                Source: University of Kentucky Department of Anthropology
              </span>
              <button
                onClick={onCloseSlideModal}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Close Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FIELD EVIDENCE MODAL (1337 COOPER DR HEADSTONES & WALL) */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Camera className="w-4 h-4 text-red-400" />
                <span>Field Evidence: Enslaved Cemetery Headstones & Plantation Wall</span>
              </div>
              <button
                onClick={onCloseEvidenceModal}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-900/60 rounded-xl space-y-1 text-slate-300">
              <div className="font-bold text-red-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Location: 1337 Cooper Drive, Lexington, Kentucky (38.014495° N, -84.479273° W)
              </div>
              <p className="text-[11px] leading-relaxed">
                During dissertation fieldwork for the University of Kentucky, B.P. Thompson cross-referenced the 1865 Ashland Farm map and aerial fence-lines to locate physical, in-situ limestone field headstones marking the graves of enslaved plantation workers in the rear wooded lot line of 1337 Cooper Drive.
              </p>
            </div>

            {/* 3 Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1.5">
                <div className="h-52 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src="./maps/cemetery_field_evidence_0.png"
                    alt="1337 Cooper Dr Google Earth Pinpoint"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-bold text-slate-200 text-[11px]">1. Satellite Pinpoint</div>
                <p className="text-[10px] text-slate-400">
                  Google Earth location at 1337 Cooper Drive facing the rear wooded boundary.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="h-52 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src="./maps/cemetery_field_evidence_1.png"
                    alt="Wooded Property Boundary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-bold text-slate-200 text-[11px]">2. Tree-Line Boundary</div>
                <p className="text-[10px] text-slate-400">
                  Wooded boundary line dividing modern residential parcels where the historic stone wall stands.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="h-52 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src="./maps/cemetery_field_evidence_2.png"
                    alt="Historic Limestone Headstone Detail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-bold text-slate-200 text-[11px]">3. Headstone in Situ</div>
                <p className="text-[10px] text-slate-400">
                  Close-up view of the weathered limestone field marker still standing in the brush.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onCloseEvidenceModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Back to Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

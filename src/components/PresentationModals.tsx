import React, { useEffect } from "react";
import { AnalysisChapter } from "../data/analysisChapters";
import { Camera, FileImage, MapPin, Database, Archive, Download, ExternalLink as LinkIcon, X } from "lucide-react";

interface Props {
  chapter: AnalysisChapter;
  isSlideModalOpen: boolean;
  isEvidenceModalOpen: boolean;
  isSourcesModalOpen: boolean;
  onCloseSlideModal: () => void;
  onCloseEvidenceModal: () => void;
  onCloseSourcesModal: () => void;
}

/* ------------------------------------------------------------------------------------------------
 * Shared modal shell
 *  - fills the phone screen with small margins; capped at 92vh with an internally scrolling body
 *  - a real, always-visible X button (40x40 touch target) pinned in a sticky header
 *  - closes on backdrop tap and on Escape
 * ---------------------------------------------------------------------------------------------- */
function Modal({
  open,
  onClose,
  icon,
  title,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[3000] flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl text-xs flex flex-col overflow-hidden"
      >
        {/* Sticky header with close button */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2 text-white font-bold text-sm min-w-0 leading-snug">
            <span className="shrink-0">{icon}</span>
            <span className="min-w-0">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-10 h-10 -mr-1 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4 min-h-0">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900 shrink-0 flex flex-wrap items-center justify-between gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const closeBtn = "px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-lg font-semibold border border-slate-700";

export function PresentationModals({
  chapter,
  isSlideModalOpen,
  isEvidenceModalOpen,
  isSourcesModalOpen,
  onCloseSlideModal,
  onCloseEvidenceModal,
  onCloseSourcesModal
}: Props) {
  return (
    <>
      {/* 1. ORIGINAL PRESENTATION SLIDE MODAL */}
      <Modal
        open={isSlideModalOpen}
        onClose={onCloseSlideModal}
        icon={<FileImage className="w-4 h-4 text-amber-500" />}
        title={<>Original Presentation Slide <span className="text-slate-400 font-normal">({chapter.slideRef})</span></>}
        footer={
          <>
            <span className="text-slate-500 text-[11px]">Source: B.P. Thompson, University of Kentucky Department of Anthropology</span>
            <button onClick={onCloseSlideModal} className={closeBtn}>Close Slide</button>
          </>
        }
      >
        <p className="text-slate-300 text-xs">
          Extracted directly from B.P. Thompson's dissertation proposal defense: <i>{chapter.title}</i>.
        </p>
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
          <img src={chapter.rawSlideUrl} alt={chapter.title} className="max-h-[65vh] w-auto max-w-full object-contain" />
        </div>
      </Modal>

      {/* 2. FIELD EVIDENCE MODAL (1337 COOPER DR HEADSTONES & WALL) */}
      <Modal
        open={isEvidenceModalOpen}
        onClose={onCloseEvidenceModal}
        icon={<Camera className="w-4 h-4 text-red-400" />}
        title="Field Evidence: Enslaved Cemetery Headstones & Plantation Wall"
        footer={
          <>
            <span className="text-slate-500 text-[11px]">Photographs: B.P. Thompson</span>
            <button onClick={onCloseEvidenceModal} className={closeBtn}>Back to Analysis</button>
          </>
        }
      >
        <div className="p-3 bg-red-950/20 border border-red-900/60 rounded-xl space-y-1 text-slate-300">
          <div className="font-bold text-red-300 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Location: 1337 Cooper Drive, Lexington, Kentucky (38.014495° N, -84.479273° W)</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            During dissertation fieldwork for the University of Kentucky, B.P. Thompson cross-referenced the 1865 Ashland Farm map and aerial fence-lines to locate physical, in-situ limestone field headstones marking the graves of enslaved plantation workers in the rear wooded lot line of 1337 Cooper Drive.
          </p>
        </div>

        {/* 3 Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { src: "./maps/cemetery_field_evidence_0.png", alt: "1337 Cooper Dr Google Earth pinpoint", title: "1. Satellite Pinpoint", text: "Google Earth location at 1337 Cooper Drive facing the rear wooded boundary." },
            { src: "./maps/cemetery_field_evidence_1.png", alt: "Wooded property boundary", title: "2. Tree-Line Boundary", text: "Wooded boundary line dividing modern residential parcels where the historic stone wall stands." },
            { src: "./maps/cemetery_field_evidence_2.png", alt: "Historic limestone headstone detail", title: "3. Headstone in Situ", text: "Close-up view of the weathered limestone field marker still standing in the brush." }
          ].map((ph) => (
            <div key={ph.src} className="space-y-1.5">
              <div className="h-44 sm:h-52 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img src={ph.src} alt={ph.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="font-bold text-slate-200 text-[11px]">{ph.title}</div>
              <p className="text-[10px] text-slate-400">{ph.text}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* 3. ARCHIVAL SOURCES & MASTER REPOSITORIES MODAL */}
      <Modal
        open={isSourcesModalOpen}
        onClose={onCloseSourcesModal}
        icon={<Archive className="w-4 h-4 text-amber-500" />}
        title="Archival Sources & Master Negative Retrieval Guide"
        footer={<><span /><button onClick={onCloseSourcesModal} className={closeBtn}>Close Guide</button></>}
      >
        <p className="text-slate-300 text-xs leading-relaxed">
          High-resolution uncompressed archival master files and original TIFF negatives have been retrieved directly from the Library of Congress and federal surveys, stored in full resolution in <code>public/maps/archival_masters/</code>:
        </p>

        {/* REPOSITORY MASTER TIFF DOWNLOADS BANNER */}
        <div className="p-3 sm:p-4 bg-emerald-950/30 border border-emerald-700/60 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              Archival Master TIFF Files Preserved in Repository
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700 font-mono text-[10px]">
              Total: 108 MB Archival TIFFs
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <a href="./maps/archival_masters/1877_beers_fayette_county_plate_30_ashland.tif" download="1877_beers_fayette_county_plate_30_ashland.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-900/80 hover:border-emerald-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-emerald-300">1877 Beers Plate 30</span><span className="text-[10px] text-emerald-400 font-mono shrink-0">31.1 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Ashland, Tates Creek, Mansfield (LOC Master)</span>
            </a>
            <a href="./maps/archival_masters/1877_beers_lexington_plate_26_wards_1_4.tif" download="1877_beers_lexington_plate_26_wards_1_4.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-900/80 hover:border-emerald-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-emerald-300">1877 Beers Plate 26</span><span className="text-[10px] text-emerald-400 font-mono shrink-0">31.8 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Lexington Wards 1 & 4 / Ky University</span>
            </a>
            <a href="./maps/archival_masters/1877_beers_lexington_plate_24_wards_2_3.tif" download="1877_beers_lexington_plate_24_wards_2_3.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-900/80 hover:border-emerald-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-emerald-300">1877 Beers Plate 24</span><span className="text-[10px] text-emerald-400 font-mono shrink-0">31.6 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Lexington Wards 2 & 3 / Track</span>
            </a>
            <a href="./maps/archival_masters/1949_usgs_aerial_GS_JS_2_10_master.tif" download="1949_usgs_aerial_GS_JS_2_10_master.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-blue-900/80 hover:border-blue-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-blue-300">1949 USGS GS-JS 2-10</span><span className="text-[10px] text-blue-400 font-mono shrink-0">8.2 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Pre-subdivision aerial safety film negative</span>
            </a>
            <a href="./maps/archival_masters/1965_usgs_aerial_lexington_master.tif" download="1965_usgs_aerial_lexington_master.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-blue-900/80 hover:border-blue-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-blue-300">1965 USGS Aerial</span><span className="text-[10px] text-blue-400 font-mono shrink-0">4.3 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Chevy Chase subdivision growth master</span>
            </a>
            <a href="./maps/archival_masters/1865_ashland_farm_survey_master.tif" download="1865_ashland_farm_survey_master.tif" className="flex flex-col p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-amber-900/80 hover:border-amber-500 rounded-lg transition group">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-200 text-[11px] group-hover:text-amber-300">1865 Ashland Farm Master</span><span className="text-[10px] text-amber-400 font-mono shrink-0">1.2 MB</span></div>
              <span className="text-[10px] text-slate-400 mt-0.5">Richard M. Bean archival estate plat</span>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {/* USGS 1949 Aerial */}
          <div className="p-3.5 bg-slate-850 border border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                1. 1949 USGS Aerial Survey (Slide 10)
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px]">
                Project: GS-JS | Roll: 2 | Frame: 10
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <b>Repository:</b> U.S. Geological Survey (USGS) Earth Resources Observation and Science (EROS) Center & National Archives (NARA Record Group 57). <br />
              <b>Symbol Code:</b> In mid-century USDA/USGS aerial surveys, <code>JS</code> was the specific county symbol for <b>Fayette County, Kentucky</b>. <br />
              <b>How to obtain raw scan:</b> Search <a href="https://earthexplorer.usgs.gov" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">USGS EarthExplorer <LinkIcon className="w-2.5 h-2.5" /></a> under <i>Aerial Photography → Aerial Photo Single Frames</i> for coordinates <code>38.0286, -84.4789</code> and Project <code>GS-JS</code>. You can download the 1,200 DPI master scan.
            </p>
          </div>

          {/* 1865 Map & Land Purchases */}
          <div className="p-3.5 bg-slate-850 border border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-400 shrink-0" />
                2. 1865 Map of Ashland Farm & Land Purchases 1800-1900 (Slides 2, 3, 4)
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px]">
                Cartographer: Richard M. Bean (1980)
              </span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              <b>Primary Repositories:</b>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-300">
                <li><b>Ashland — The Henry Clay Memorial Foundation Archives:</b> Located on site at 120 Sycamore Rd, Lexington KY. The curatorial research collection (curated by Mary Gardner Turner and foundation historians) preserves Bean's original hand-drafted Mylar and linen overlay maps.</li>
                <li><b>University of Kentucky Special Collections Research Center (SCRC):</b> Margaret I. King Library. Holds the Henry Clay Family Papers, Richard M. Bean research papers, and Fayette County historic plat books.</li>
                <li><b>Lexington Public Library (Central Library — Kentucky Room):</b> Houses Richard M. Bean's publication <i>A History of the Henry Clay Family Properties</i> (Call No. <code>Ky 929.2 C619b</code>).</li>
              </ul>
            </div>
          </div>

          {/* 1877 Beers Atlas */}
          <div className="p-3.5 bg-slate-850 border border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                3. 1877 D.G. Beers & Co. Atlas of Fayette County
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">
                LOC Control No: 2005627107
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <b>Library of Congress Master Scan:</b> High-resolution uncompressed master color TIFF scans of the entire 1877 Fayette County atlas are available directly on the <a href="https://www.loc.gov/item/2005627107/" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">Library of Congress Map Division <LinkIcon className="w-2.5 h-2.5" /></a> website. Shows property parcels for Ashland, Ashland-on-Tates-Creek, and Mansfield.
            </p>
          </div>

          {/* HABS Architectural Drawings */}
          <div className="p-3.5 bg-slate-850 border border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400 shrink-0" />
                4. Historic American Buildings Survey (HABS No. KY-172)
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px]">
                HABS No. KY-172 & KY-172-B
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <b>Library of Congress HABS Collection:</b> Measured drawings, architectural floor plans, dependency elevations (smokehouse, dairy, carriage house), and historic black-and-white 8x10 negatives cataloged under <a href="https://www.loc.gov/pictures/collection/hh/" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">HABS Collections <LinkIcon className="w-2.5 h-2.5" /></a>.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

import { useEffect } from "react";
import { useGlossary } from "../context/GlossaryContext";
import { GLOSSARY } from "../data/glossary";

export function GlossarySidebar() {
  const { activeTerm, setActiveTerm } = useGlossary();
  const entry = activeTerm ? GLOSSARY[activeTerm] : null;
  const close = () => setActiveTerm(null);

  // Close on Escape key
  useEffect(() => {
    if (!entry) return;
    const handler = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entry]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 no-print ${
          entry ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Side panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col
          transition-transform duration-250 ease-out no-print ${
          entry ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={entry?.term ?? "Glossary"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-0.5">Glossary</p>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{entry?.term ?? ""}</h3>
          </div>
          <button
            onClick={close}
            className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-sm"
            aria-label="Close glossary"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {entry && (
            <>
              <p className="text-sm text-gray-700 leading-relaxed">{entry.explanation}</p>

              {entry.wikiUrl && (
                <a
                  href={entry.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 group"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 text-xs transition-colors">W</span>
                  Read more on Wikipedia
                </a>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">Click any <span className="border-b border-dashed border-blue-400">underlined term</span> to look it up</p>
        </div>
      </div>
    </>
  );
}

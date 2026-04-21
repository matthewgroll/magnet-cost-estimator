import { useGlossary } from "../context/GlossaryContext";

export function GlossaryTerm({ id, children, className = "" }) {
  const { setActiveTerm } = useGlossary();
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setActiveTerm(id)}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && setActiveTerm(id)}
      className={`border-b border-dashed border-blue-400 cursor-help hover:border-blue-600 hover:text-blue-700 transition-colors ${className}`}
    >
      {children}
    </span>
  );
}

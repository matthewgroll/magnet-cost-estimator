import { useState, useMemo, useCallback } from "react";
import {
  GRADES, MATERIAL_PROPS, COATINGS, TOLERANCE_CLASSES, TEMP_RANGES, QTY_TIERS,
  getTemperatureWarning
} from "./data/magnetData";
import { calcVolume, calcSurfaceArea, GEOMETRY_DIMS } from "./utils/geometry";
import { calcCost } from "./utils/costCalc";
import { GlossaryProvider } from "./context/GlossaryContext";
import { GlossaryTerm } from "./components/GlossaryTerm";
import { GlossarySidebar } from "./components/GlossarySidebar";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmt = (n, d = 2) =>
  n == null ? "—" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtMass = (kg) => {
  if (kg < 0.001) return `${(kg * 1e6).toFixed(1)} mg`;
  if (kg < 1) return `${(kg * 1000).toFixed(2)} g`;
  return `${kg.toFixed(4)} kg`;
};
const fmtVol = (m3) => {
  if (m3 < 1e-6) return `${(m3 * 1e9).toFixed(2)} mm³`;
  return `${(m3 * 1e6).toFixed(4)} cm³`;
};
const fmtKg = (usdPerKg) => {
  if (!usdPerKg || !isFinite(usdPerKg)) return "—";
  return `$${fmt(usdPerKg, 0)}/kg`;
};

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------
function Section({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {title && <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">{title}</h2>}
      {children}
    </div>
  );
}

function Field({ label, children, note }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
      {note && <span className="text-xs text-blue-500 font-medium">{note}</span>}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800";
const selectCls = `${inputCls} cursor-pointer`;

function RowLine({ label, value, sub, highlight, indent, muted }) {
  return (
    <div className={`flex items-baseline justify-between py-2 ${highlight ? "border-t-2 border-blue-100 mt-1 pt-3" : ""}`}>
      <span className={`text-sm ${indent ? "pl-4 text-gray-400" : muted ? "text-gray-400" : highlight ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
      <span className={`font-mono text-sm ml-4 text-right ${highlight ? "text-blue-700 font-bold text-base" : muted ? "text-gray-400" : "text-gray-700"}`}>
        {value}
        {sub && <span className="text-xs text-gray-400 ml-1">{sub}</span>}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sources section
// ---------------------------------------------------------------------------
const SOURCES = [
  {
    label: "NdFeB rare-earth feedstock pricing (Nd, Dy oxides)",
    urls: ["https://www.metal.com/Rare-Earth", "https://www.mineralprices.com"],
  },
  {
    label: "SmCo rare-earth feedstock pricing (Sm, Co metals)",
    urls: ["https://www.metal.com/Rare-Earth"],
  },
  {
    label: "Hard Ferrite (BaFe/SrFe) powder — market survey, ~$1.5–3/kg",
    urls: ["https://www.alibaba.com"],
  },
  {
    label: "AlNiCo alloy cost (Al, Ni, Co, Fe blend) — market reference",
    urls: ["https://www.alibaba.com"],
  },
  {
    label: "Processing & sintering cost benchmarks (open-access powder metallurgy literature)",
    urls: ["https://www.intechopen.com"],
  },
  {
    label: "Coating cost adders — trade reference",
    urls: ["https://www.ndfebmagnet.com"],
  },
];

function SourcesSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden print-sources">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 text-left no-print"
      >
        <span className="text-sm font-semibold text-gray-700">Sources &amp; Assumptions</span>
        <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      <div className={open ? "block" : "hidden print-sources-body"}>
        <div className="px-5 py-4 space-y-4 bg-white text-sm text-gray-600">
          <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
            All cost figures are indicative baselines from publicly available market data (Q4 2023 – Q1 2024).
            Actual prices vary by supplier, quantity, and market conditions. This tool is for estimation purposes only.
          </p>
          <ul className="space-y-3">
            {SOURCES.map((s, i) => (
              <li key={i} className="flex flex-col gap-1">
                <span className="font-medium text-gray-700">{s.label}</span>
                <span className="flex flex-wrap gap-2">
                  {s.urls.map(u => (
                    <a key={u} href={u} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs break-all">{u}</a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1.5">
            <p><strong>Yield:</strong> fraction of feedstock that becomes a saleable finished part after sintering, pressing, and trim. Defaults: NdFeB 82%, SmCo 80%, Ferrite 85%, AlNiCo 88%.</p>
            <p><strong>Quantity tiers:</strong> 1–99 (prototype ×2.20), 100–999 (small-batch ×1.45), 1000+ (production ×1.00).</p>
            <p><strong>Margin:</strong> floor price at 35% gross margin (cost ÷ 0.65).</p>
            <p><strong>Tolerance multipliers:</strong> Standard ×1.00, Precision ×1.20, Ultra ×1.55 — applied to processing cost.</p>
            <p><strong>Coating:</strong> priced per cm² of surface area. Ni-Cu-Ni $0.015/cm², Zinc $0.010/cm², Epoxy $0.012/cm², Gold $0.080/cm².</p>
            <p><strong>NdFeB processing:</strong> $10/kg baseline reflects Chinese integrated factory costs. Western/EU sourcing is typically $20–40/kg — use the sensitivity slider to adjust.</p>
            <p><strong>SmCo processing:</strong> $250/kg reflects specialist sintering, low production volumes, cobalt supply complexity, and market premium vs. NdFeB.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sensitivity sliders
// ---------------------------------------------------------------------------
function SensitivityPanel({ magnetType, baseYield, baseFeedCost, specs, volume, surfaceArea }) {
  const mat = MATERIAL_PROPS[magnetType];
  const [yieldPct, setYieldPct] = useState(Math.round(baseYield * 100));
  const [feedCost, setFeedCost] = useState(baseFeedCost);

  const result = useMemo(() => {
    if (!volume) return null;
    return calcCost({
      ...specs, magnetType, volumeM3: volume, surfaceAreaCm2: surfaceArea,
      yieldPct, feedstockCostPerKg: feedCost,
    });
  }, [specs, magnetType, volume, surfaceArea, yieldPct, feedCost]);

  const minFeed = Math.max(0.5, mat.feedstockCostPerKg * 0.3);
  const maxFeed = mat.feedstockCostPerKg * 2.5;
  const feedStep = mat.feedstockCostPerKg > 20 ? 1 : 0.1;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">
              <GlossaryTerm id="yieldPct">Yield %</GlossaryTerm>
            </label>
            <span className="text-sm font-mono font-bold text-blue-600">{yieldPct}%</span>
          </div>
          <input type="range" min={50} max={98} step={1} value={yieldPct}
            onChange={e => setYieldPct(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50%</span><span>98%</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">
              <GlossaryTerm id="feedstock">Feedstock</GlossaryTerm> cost (USD/kg)
            </label>
            <span className="text-sm font-mono font-bold text-blue-600">${fmt(feedCost, feedStep < 1 ? 1 : 0)}/kg</span>
          </div>
          <input type="range" min={minFeed} max={maxFeed} step={feedStep}
            value={feedCost}
            onChange={e => setFeedCost(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>${fmt(minFeed, 0)}</span><span>${fmt(maxFeed, 0)}</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Cost / part",       val: `$${fmt(result.costPerPart)}`       },
            { label: "Floor / part",      val: `$${fmt(result.floorPrice)}`        },
            { label: "Cost / kg",         val: fmtKg(result.costPerKg)             },
            { label: "Floor / kg",        val: fmtKg(result.floorPricePerKg)       },
          ].map(({ label, val }) => (
            <div key={label} className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-400 mb-1">{label}</div>
              <div className="font-mono font-bold text-blue-800 text-sm">{val}</div>
            </div>
          ))}
        </div>
      )}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Batch cost",        val: `$${fmt(result.batchCost, 0)}`      },
            { label: "Batch floor price", val: `$${fmt(result.batchFloorPrice, 0)}`},
          ].map(({ label, val }) => (
            <div key={label} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
              <div className="text-xs text-indigo-400 mb-1">{label}</div>
              <div className="font-mono font-bold text-indigo-800 text-sm">{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase 2 — Results
// ---------------------------------------------------------------------------
function ResultsPhase({ specs, volume, surfaceArea, result, onBack }) {
  const mat = MATERIAL_PROPS[specs.magnetType];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-white">
          ← Back to spec
        </button>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
          🖨 Print estimate
        </button>
      </div>

      {/* Print-only header */}
      <div className="print-block py-2">
        <h1 className="text-2xl font-bold text-gray-900">Magnet Cost Estimate</h1>
        <p className="text-sm text-gray-500">
          Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Spec summary */}
      <Section title="Magnet Specification">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["Type", specs.magnetType],
            ["Grade", specs.grade],
            ["Geometry", specs.geometry],
            ["Quantity", specs.quantity.toLocaleString() + " pcs"],
            ["Tolerance", TOLERANCE_CLASSES.find(t => t.value === specs.toleranceClass)?.label],
            ["Coating", COATINGS.find(c => c.value === specs.coating)?.label],
            ["Op. Temp", TEMP_RANGES.find(t => t.value === specs.tempRange)?.label],
            ["Volume", fmtVol(volume)],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-0.5">{k}</div>
              <div className="font-medium text-gray-800 text-sm leading-snug">{v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Cost breakdown */}
      <Section title="Cost Breakdown — Per Part">
        <div className="divide-y divide-gray-100">
          <RowLine label="Finished part volume" value={fmtVol(volume)} />
          <RowLine label="Finished part mass" value={fmtMass(result.massPerPart)} />
          <RowLine label="Surface area" value={`${result.surfaceAreaCm2.toFixed(2)} cm²`} muted />
          <RowLine
            label={<><GlossaryTerm id="feedstock">Feedstock</GlossaryTerm> required (÷ <GlossaryTerm id="yieldPct">yield</GlossaryTerm> {(result.yieldFrac * 100).toFixed(0)}%)</>}
            value={fmtMass(result.feedstockPerPart)} indent />
          <RowLine
            label={<>  Feedstock cost @ ${fmt(result.feedCostUsed, 2)}/kg</>}
            value={`$${fmt(result.feedstockCostPerPart)}`} indent />
          <RowLine
            label={<><GlossaryTerm id="processingCost">Processing</GlossaryTerm> / <GlossaryTerm id="sintering">sintering</GlossaryTerm> / pressing</>}
            value={`$${fmt(result.processingCostPerPart)}`} />
          {result.toleranceMultiplier > 1 && (
            <RowLine
              label={<>  <GlossaryTerm id="toleranceClass">Tolerance</GlossaryTerm> adder — {result.toleranceLabel} (×{result.toleranceMultiplier.toFixed(2)})</>}
              value={`+$${fmt(result.machinedProcessingCost - result.processingCostPerPart)}`} indent />
          )}
          <RowLine
            label={<><GlossaryTerm id="coating">Coating</GlossaryTerm> — {result.coatingLabel}{result.coatingRatePerCm2 > 0 ? ` ($${result.coatingRatePerCm2}/cm²)` : ""}</>}
            value={result.coatingCost > 0 ? `$${fmt(result.coatingCost)}` : "—"} />
          <RowLine
            label={<><GlossaryTerm id="batchPricing">Quantity tier</GlossaryTerm>: {result.tierLabel} (×{result.tierMultiplier.toFixed(2)})</>}
            value="" muted />
          <RowLine label="Cost per part"        value={`$${fmt(result.costPerPart)}`}    highlight />
          <RowLine label="Cost per kg"          value={fmtKg(result.costPerKg)}          highlight />
          <RowLine
            label={<><GlossaryTerm id="floorPrice">Floor price</GlossaryTerm> / part (<GlossaryTerm id="grossMargin">35% margin</GlossaryTerm>)</>}
            value={`$${fmt(result.floorPrice)}`} highlight />
          <RowLine label="Floor price / kg"     value={fmtKg(result.floorPricePerKg)}    highlight />
        </div>
      </Section>

      {/* Batch totals */}
      <Section title={`Batch Totals — ${specs.quantity.toLocaleString()} pcs`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Total batch cost",        val: `$${fmt(result.batchCost, 2)}`,        note: "Full production cost",     color: "blue"   },
            { label: "Batch floor price",        val: `$${fmt(result.batchFloorPrice, 2)}`,  note: "At 35% gross margin",      color: "indigo" },
            { label: "Cost per kg (material)",   val: fmtKg(result.costPerKg),               note: "Useful for benchmarking",  color: "slate"  },
            { label: "Floor price per kg",       val: fmtKg(result.floorPricePerKg),         note: "At 35% gross margin",      color: "slate"  },
          ].map(({ label, val, note, color }) => (
            <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-4`}>
              <div className={`text-xs text-${color}-400 mb-1`}>{note}</div>
              <div className={`text-xl font-bold font-mono text-${color}-800`}>{val}</div>
              <div className={`text-sm text-${color}-600 mt-0.5`}>{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
          Total feedstock mass: <span className="font-mono font-medium text-gray-700">{fmtMass(result.feedstockPerPart * specs.quantity)}</span>
          {" · "}
          Finished part mass: <span className="font-mono font-medium text-gray-700">{fmtMass(result.massPerPart * specs.quantity)}</span>
        </div>
      </Section>

      {/* Sensitivity */}
      <Section title="Sensitivity Analysis" className="no-print">
        <p className="text-xs text-gray-400 mb-5">
          Drag to see how <GlossaryTerm id="yieldPct">yield</GlossaryTerm> and <GlossaryTerm id="feedstock">feedstock</GlossaryTerm> price shift all cost metrics in real time.
        </p>
        <SensitivityPanel
          magnetType={specs.magnetType}
          baseYield={mat.yieldDefault}
          baseFeedCost={mat.feedstockCostPerKg}
          specs={{ coating: specs.coating, toleranceClass: specs.toleranceClass, quantity: specs.quantity }}
          volume={volume}
          surfaceArea={surfaceArea}
        />
      </Section>

      {/* Print-only sensitivity note */}
      <div className="print-block">
        <Section title="Sensitivity Baseline">
          <p className="text-sm text-gray-600">
            Baseline yield: {(mat.yieldDefault * 100).toFixed(0)}%&nbsp;|&nbsp;
            Feedstock: ${fmt(mat.feedstockCostPerKg)}/kg&nbsp;|&nbsp;
            Processing: ${mat.processingCostPerKg}/kg&nbsp;|&nbsp;
            Target margin: 35%
          </p>
        </Section>
      </div>

      <SourcesSection />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase 1 — Spec selector
// ---------------------------------------------------------------------------
const DEFAULT_DIMS = {
  length: 10, width: 10, height: 5,
  diameter: 10,
  od: 20, id: 10,
  arc_angle: 90,
};

const TYPE_LABELS = {
  NdFeB:   { short: "NdFeB",       glossary: "ndfeb"   },
  SmCo:    { short: "SmCo",        glossary: "smco"    },
  Ferrite: { short: "Hard Ferrite",glossary: "ferrite" },
  AlNiCo:  { short: "AlNiCo",      glossary: "alnico"  },
};

export default function App() {
  const [phase, setPhase] = useState(1);
  const [magnetType, setMagnetType] = useState("NdFeB");
  const [grade, setGrade] = useState("N42");
  const [geometry, setGeometry] = useState("Block");
  const [dims, setDims] = useState(DEFAULT_DIMS);
  const [quantity, setQuantity] = useState(100);
  const [toleranceClass, setToleranceClass] = useState("standard");
  const [coating, setCoating] = useState("nickel");
  const [tempRange, setTempRange] = useState("lt80");

  const grades = GRADES[magnetType] ?? [];
  const selectedGradeObj = grades.find(g => g.value === grade);

  const handleTypeChange = useCallback((t) => {
    setMagnetType(t);
    setGrade(GRADES[t]?.[0]?.value ?? "");
  }, []);

  const mat = MATERIAL_PROPS[magnetType];
  const volume = useMemo(() => calcVolume(geometry, dims), [geometry, dims]);
  const surfaceArea = useMemo(() => calcSurfaceArea(geometry, dims), [geometry, dims]);

  const result = useMemo(() => {
    if (!volume) return null;
    return calcCost({
      magnetType, coating, toleranceClass, quantity,
      volumeM3: volume,
      surfaceAreaCm2: surfaceArea,
      yieldPct: Math.round(mat.yieldDefault * 100),
      feedstockCostPerKg: mat.feedstockCostPerKg,
    });
  }, [magnetType, coating, toleranceClass, quantity, volume, surfaceArea, mat]);

  const tempWarning = getTemperatureWarning(grade, tempRange, magnetType);
  const currentTier = QTY_TIERS.find(t => quantity >= t.min && quantity <= t.max);
  const dimFields = GEOMETRY_DIMS[geometry] ?? [];
  const canCalculate = volume > 0 && quantity > 0 && grade;
  const specs = { magnetType, grade, geometry, quantity, toleranceClass, coating, tempRange };

  return (
    <GlossaryProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Header */}
          <div className="text-center py-4 no-print">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Magnet Cost Estimator
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">
              <GlossaryTerm id="sintering">Sintered</GlossaryTerm> permanent magnets — prototype to production pricing
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tap any <span className="border-b border-dashed border-blue-400 cursor-help">underlined term</span> for a plain-English explanation
            </p>
          </div>

          {/* Print-only header */}
          <div className="print-block py-2">
            <h1 className="text-2xl font-bold text-gray-900">Magnet Cost Estimate</h1>
            <p className="text-sm text-gray-500">
              Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {phase === 1 ? (
            <>
              {/* --- Material --- */}
              <Section title="Material">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Magnet type">
                    {/* Custom button-style type selector with glossary terms */}
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(TYPE_LABELS).map(([t, meta]) => (
                        <button key={t}
                          onClick={() => handleTypeChange(t)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border text-left ${
                            magnetType === t
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                          }`}>
                          {magnetType === t
                            ? meta.short
                            : <GlossaryTerm id={meta.glossary}>{meta.short}</GlossaryTerm>
                          }
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={<><GlossaryTerm id="grade">Grade</GlossaryTerm></>}>
                    <select className={selectCls} value={grade} onChange={e => setGrade(e.target.value)}>
                      {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                    {selectedGradeObj && (
                      <span className="text-xs text-gray-400">
                        <GlossaryTerm id="remanence">Br</GlossaryTerm>: {selectedGradeObj.br} T
                        {" · "}
                        <GlossaryTerm id="coercivity">Hci</GlossaryTerm>: {selectedGradeObj.hci} kA/m
                        {" · "}
                        Max: {selectedGradeObj.maxTemp} °C
                      </span>
                    )}
                  </Field>
                </div>
              </Section>

              {/* --- Geometry --- */}
              <Section title="Part Geometry">
                <div className="mb-5">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Shape</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Block", "Cylinder", "Ring", "Arc"].map(g => (
                      <button key={g}
                        onClick={() => setGeometry(g)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                          geometry === g
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dimFields.map(d => (
                    <Field key={d.key} label={d.label}>
                      <input
                        type="number"
                        className={inputCls}
                        min={d.min ?? 0}
                        max={d.max}
                        step={d.step ?? 0.1}
                        value={dims[d.key] ?? d.defaultVal ?? ""}
                        onChange={e => setDims(prev => ({ ...prev, [d.key]: parseFloat(e.target.value) || 0 }))}
                      />
                    </Field>
                  ))}
                </div>
                {volume > 0 && (
                  <div className="mt-4 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex flex-wrap gap-4">
                    <span>Volume: <span className="font-mono text-blue-700">{fmtVol(volume)}</span></span>
                    <span>Mass: <span className="font-mono text-blue-700">{fmtMass(volume * (mat?.density ?? 7500))}</span></span>
                    <span>Surface area: <span className="font-mono text-blue-700">{surfaceArea.toFixed(2)} cm²</span></span>
                  </div>
                )}
              </Section>

              {/* --- Order Parameters --- */}
              <Section title="Order Parameters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Quantity">
                    <input type="number" className={inputCls} min={1} step={1} value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                    <div className="flex gap-2 mt-1">
                      {QTY_TIERS.map((t, i) => {
                        const labels = ["1 – 99", "100 – 999", "1,000+"];
                        const vals = [1, 100, 1000];
                        return (
                          <button key={i}
                            onClick={() => setQuantity(vals[i])}
                            className={`flex-1 text-xs px-2 py-1 rounded-md border transition-colors ${
                              currentTier?.min === t.min
                                ? "bg-blue-100 border-blue-300 text-blue-700 font-semibold"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-200"
                            }`}>
                            {labels[i]}
                          </button>
                        );
                      })}
                    </div>
                    {currentTier && (
                      <span className="text-xs text-blue-500 font-medium">
                        → <GlossaryTerm id="batchPricing">{currentTier.label}</GlossaryTerm> (×{currentTier.multiplier.toFixed(2)})
                      </span>
                    )}
                  </Field>

                  <Field label={<GlossaryTerm id="toleranceClass">Tolerance class</GlossaryTerm>}>
                    <select className={selectCls} value={toleranceClass} onChange={e => setToleranceClass(e.target.value)}>
                      {TOLERANCE_CLASSES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </Field>

                  <Field label={<GlossaryTerm id="coating">Surface coating</GlossaryTerm>}>
                    <select className={selectCls} value={coating} onChange={e => setCoating(e.target.value)}>
                      {COATINGS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    {coating !== "none" && surfaceArea > 0 && (
                      <span className="text-xs text-gray-400">
                        {surfaceArea.toFixed(1)} cm² × ${COATINGS.find(c => c.value === coating)?.ratePerCm2}/cm²
                        {" = "}
                        ${(surfaceArea * (COATINGS.find(c => c.value === coating)?.ratePerCm2 ?? 0)).toFixed(3)}
                      </span>
                    )}
                  </Field>

                  <Field label="Operating temperature">
                    <select className={selectCls} value={tempRange} onChange={e => setTempRange(e.target.value)}>
                      {TEMP_RANGES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    {magnetType === "NdFeB" && (tempRange === "120to180" || tempRange === "gt180") && (
                      <span className="text-xs text-amber-500">
                        High-temp NdFeB grades use <GlossaryTerm id="dysprosium">dysprosium</GlossaryTerm> — feedstock cost is higher
                      </span>
                    )}
                  </Field>
                </div>

                {tempWarning && (
                  <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <span className="text-amber-500 text-lg flex-shrink-0">⚠</span>
                    <p className="text-sm text-amber-800">{tempWarning}</p>
                  </div>
                )}
              </Section>

              {/* Live price preview */}
              {result && (
                <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Live estimate preview</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-baseline justify-between col-span-2 mb-1">
                      <span className="text-gray-600 text-sm">Cost per part</span>
                      <span className="font-mono text-2xl font-bold text-blue-700">${fmt(result.costPerPart)}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-500 text-sm">Cost per kg</span>
                      <span className="font-mono text-sm font-semibold text-gray-600">{fmtKg(result.costPerKg)}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-500 text-sm">
                        <GlossaryTerm id="floorPrice">Floor price</GlossaryTerm> / part
                      </span>
                      <span className="font-mono text-sm font-semibold text-indigo-600">${fmt(result.floorPrice)}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-400 text-sm">Floor per kg</span>
                      <span className="font-mono text-sm text-gray-500">{fmtKg(result.floorPricePerKg)}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-400 text-sm">Batch ({quantity.toLocaleString()} pcs)</span>
                      <span className="font-mono text-sm text-gray-500">${fmt(result.batchCost, 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!canCalculate}
                onClick={() => setPhase(2)}
                className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm text-sm"
              >
                {canCalculate ? "View full cost breakdown →" : "Enter part dimensions to continue"}
              </button>
            </>
          ) : (
            <ResultsPhase
              specs={specs}
              volume={volume}
              surfaceArea={surfaceArea}
              result={result}
              onBack={() => setPhase(1)}
            />
          )}
        </div>
      </div>

      {/* Glossary sidebar — rendered outside the scroll container so it can overlay everything */}
      <GlossarySidebar />
    </GlossaryProvider>
  );
}

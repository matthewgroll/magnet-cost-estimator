// ---------------------------------------------------------------------------
// Magnet grades by type
// ---------------------------------------------------------------------------
export const GRADES = {
  NdFeB: [
    { value: "N35",    label: "N35",    br: 1.17, hci: 955,  maxTemp: 80  },
    { value: "N42",    label: "N42",    br: 1.30, hci: 955,  maxTemp: 80  },
    { value: "N48",    label: "N48",    br: 1.38, hci: 876,  maxTemp: 80  },
    { value: "N52",    label: "N52",    br: 1.43, hci: 876,  maxTemp: 60  },
    { value: "N35SH",  label: "N35SH",  br: 1.17, hci: 1592, maxTemp: 150 },
    { value: "N42SH",  label: "N42SH",  br: 1.30, hci: 1592, maxTemp: 150 },
    { value: "N35UH",  label: "N35UH",  br: 1.17, hci: 1990, maxTemp: 180 },
    { value: "N38EH",  label: "N38EH",  br: 1.22, hci: 2388, maxTemp: 200 },
  ],
  SmCo: [
    { value: "SmCo18", label: "SmCo 18 (Sm1Co5)", br: 0.85, hci: 1432, maxTemp: 250 },
    { value: "SmCo26", label: "SmCo 26 (Sm2Co17)", br: 1.05, hci: 1432, maxTemp: 300 },
    { value: "SmCo28", label: "SmCo 28 (Sm2Co17)", br: 1.08, hci: 1671, maxTemp: 350 },
  ],
  Ferrite: [
    { value: "Y30",  label: "Y30 / C8",  br: 0.38, hci: 240, maxTemp: 250 },
    { value: "Y35",  label: "Y35 / C11", br: 0.40, hci: 280, maxTemp: 250 },
    { value: "Y40",  label: "Y40",       br: 0.43, hci: 318, maxTemp: 250 },
  ],
  AlNiCo: [
    { value: "AlNiCo5", label: "AlNiCo 5", br: 1.27, hci: 51, maxTemp: 450 },
    { value: "AlNiCo8", label: "AlNiCo 8", br: 0.83, hci: 119, maxTemp: 550 },
  ],
};

// ---------------------------------------------------------------------------
// Material physical properties & baseline cost data
// Feedstock costs derived from:
//   NdFeB: ~$60–80/kg sintered alloy equivalent (Nd ~$60/kg, Dy ~$250/kg)
//          https://www.metal.com/Rare-Earth | https://www.mineralprices.com
//   SmCo:  ~$90–120/kg (Sm ~$15/kg but Co ~$33/kg; alloy cost dominated by Co+Sm)
//          https://www.metal.com/Rare-Earth
//   Ferrite: ~$1.5–3/kg barium/strontium ferrite powder
//          https://www.alibaba.com (market survey Q4 2023)
//   AlNiCo: ~$20–35/kg (Al, Ni, Co, Fe blend)
//          Industry average; see https://www.alibaba.com
// Processing/sintering cost benchmarks:
//   https://www.intechopen.com (Powder Metallurgy open-access literature)
// ---------------------------------------------------------------------------
export const MATERIAL_PROPS = {
  NdFeB: {
    density: 7500,           // kg/m³
    feedstockCostPerKg: 70,  // USD/kg baseline (Nd ~$60–80/kg; N42 needs no Dy; SH/UH/EH add Dy at ~$250/kg)
    processingCostPerKg: 10, // USD/kg — Chinese integrated factory baseline (jet-mill, press, sinter, slice)
    // Note: Western/EU processing is $20–40/kg; use sensitivity slider to model non-Chinese sourcing
    yieldDefault: 0.82,      // sintering yield (mass fraction)
  },
  SmCo: {
    density: 8400,
    feedstockCostPerKg: 105,
    // SmCo processing is far more expensive than NdFeB: specialty Sm2Co17 sintering, cobalt supply complexity,
    // very low production volumes vs. NdFeB, and significant market premium at small quantities.
    // $250/kg reflects realistic all-in processing for non-integrated Western/small-volume sourcing.
    processingCostPerKg: 250,
    yieldDefault: 0.80,
  },
  Ferrite: {
    density: 4900,
    feedstockCostPerKg: 2.2,
    processingCostPerKg: 4,
    yieldDefault: 0.85,
  },
  AlNiCo: {
    density: 7300,
    feedstockCostPerKg: 27,
    // AlNiCo is produced in much lower volumes than NdFeB/ferrite, requires careful
    // casting or precision sintering, and commands a specialty-material premium.
    processingCostPerKg: 80,
    yieldDefault: 0.88,
  },
};

// ---------------------------------------------------------------------------
// Coating cost rates (USD per cm² of surface area)
// Replaces flat per-part adder — cost now scales with part surface area.
// Source: trade references including https://www.ndfebmagnet.com
// ---------------------------------------------------------------------------
export const COATINGS = [
  { value: "none",   label: "None",              ratePerCm2: 0.000 },
  { value: "nickel", label: "Nickel (Ni-Cu-Ni)", ratePerCm2: 0.015 },
  { value: "zinc",   label: "Zinc",              ratePerCm2: 0.010 },
  { value: "epoxy",  label: "Epoxy",             ratePerCm2: 0.012 },
  { value: "gold",   label: "Gold (Au flash)",   ratePerCm2: 0.080 },
];

// ---------------------------------------------------------------------------
// Tolerance class machining multipliers
// ---------------------------------------------------------------------------
export const TOLERANCE_CLASSES = [
  { value: "standard",  label: "Standard (±0.10 mm)", multiplier: 1.00 },
  { value: "precision", label: "Precision (±0.05 mm)", multiplier: 1.20 },
  { value: "ultra",     label: "Ultra (±0.02 mm)",     multiplier: 1.55 },
];

// ---------------------------------------------------------------------------
// Quantity tiers & price multipliers
// ---------------------------------------------------------------------------
export const QTY_TIERS = [
  { min: 1,    max: 99,   label: "Prototype pricing",   multiplier: 2.20 },
  { min: 100,  max: 999,  label: "Small-batch pricing",  multiplier: 1.45 },
  { min: 1000, max: Infinity, label: "Production pricing", multiplier: 1.00 },
];

// ---------------------------------------------------------------------------
// Operating temperature ranges
// ---------------------------------------------------------------------------
export const TEMP_RANGES = [
  { value: "lt80",     label: "< 80 °C" },
  { value: "80to120",  label: "80 – 120 °C" },
  { value: "120to180", label: "120 – 180 °C" },
  { value: "gt180",    label: "> 180 °C" },
];

// ---------------------------------------------------------------------------
// Target gross margin (floor price = cost / (1 - margin))
// ---------------------------------------------------------------------------
export const TARGET_MARGIN = 0.35;

// ---------------------------------------------------------------------------
// Grade temperature suitability warnings
// ---------------------------------------------------------------------------
export function getTemperatureWarning(grade, tempRange, magnetType) {
  const gradeObj = GRADES[magnetType]?.find(g => g.value === grade);
  if (!gradeObj) return null;

  const tempRangeMaxMap = {
    lt80: 79,
    "80to120": 120,
    "120to180": 180,
    gt180: 220,
  };

  const requiredMax = tempRangeMaxMap[tempRange];
  if (requiredMax > gradeObj.maxTemp) {
    return `Warning: ${gradeObj.label} is rated to ${gradeObj.maxTemp} °C — insufficient for the selected operating range (${TEMP_RANGES.find(t=>t.value===tempRange)?.label}). Consider a higher-temperature grade.`;
  }
  return null;
}

import { MATERIAL_PROPS, COATINGS, TOLERANCE_CLASSES, QTY_TIERS, TARGET_MARGIN } from "../data/magnetData";

export function calcCost({
  magnetType,
  coating,
  toleranceClass,
  quantity,
  volumeM3,
  surfaceAreaCm2,  // surface area in cm², used for coating cost
  yieldPct,        // 0–100
  feedstockCostPerKg,
}) {
  const mat = MATERIAL_PROPS[magnetType];
  if (!mat || volumeM3 <= 0 || quantity <= 0) return null;

  const yieldFrac = yieldPct / 100;
  const feedCost = feedstockCostPerKg ?? mat.feedstockCostPerKg;

  // Mass per finished part (kg)
  const massPerPart = volumeM3 * mat.density;

  // Feedstock needed per finished part (accounting for yield loss)
  const feedstockPerPart = massPerPart / yieldFrac;

  // Feedstock cost per part
  const feedstockCostPerPart = feedstockPerPart * feedCost;

  // Processing cost per part (sintering, pressing, basic machining)
  const processingCostPerPart = massPerPart * mat.processingCostPerKg;

  // Tolerance machining multiplier applied to processing cost
  const tolClass = TOLERANCE_CLASSES.find(t => t.value === toleranceClass) ?? TOLERANCE_CLASSES[0];
  const machinedProcessingCost = processingCostPerPart * tolClass.multiplier;

  // Coating cost scales with surface area (USD/cm²)
  const coatingObj = COATINGS.find(c => c.value === coating) ?? COATINGS[0];
  const coatingCost = (surfaceAreaCm2 ?? 0) * coatingObj.ratePerCm2;

  // Subtotal cost per part (before qty tier)
  const baseUnitCost = feedstockCostPerPart + machinedProcessingCost + coatingCost;

  // Quantity tier multiplier
  const tier = QTY_TIERS.find(t => quantity >= t.min && quantity <= t.max) ?? QTY_TIERS[QTY_TIERS.length - 1];
  const costPerPart = baseUnitCost * tier.multiplier;

  // Floor price at target margin
  const floorPrice = costPerPart / (1 - TARGET_MARGIN);

  // Per-kg pricing (useful for material benchmarking)
  const costPerKg = massPerPart > 0 ? costPerPart / massPerPart : 0;
  const floorPricePerKg = massPerPart > 0 ? floorPrice / massPerPart : 0;

  // Batch totals
  const batchCost = costPerPart * quantity;
  const batchFloorPrice = floorPrice * quantity;

  return {
    massPerPart,
    feedstockPerPart,
    feedstockCostPerPart,
    processingCostPerPart,
    machinedProcessingCost,
    coatingCost,
    surfaceAreaCm2: surfaceAreaCm2 ?? 0,
    baseUnitCost,
    tierMultiplier: tier.multiplier,
    tierLabel: tier.label,
    costPerPart,
    floorPrice,
    costPerKg,
    floorPricePerKg,
    batchCost,
    batchFloorPrice,
    yieldFrac,
    feedCostUsed: feedCost,
    toleranceMultiplier: tolClass.multiplier,
    toleranceLabel: tolClass.label,
    coatingLabel: coatingObj.label,
    coatingRatePerCm2: coatingObj.ratePerCm2,
  };
}

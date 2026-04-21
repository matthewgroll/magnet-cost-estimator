export const GLOSSARY = {
  sintering: {
    term: "Sintering",
    explanation:
      "A manufacturing process where powdered material is compacted under high pressure then heated to just below its melting point. The heat fuses the powder particles into a dense solid without fully melting them. Sintered magnets are made by pressing alloy powder into a die, then sintering in a controlled inert atmosphere to avoid oxidation.",
    wikiUrl: "https://en.wikipedia.org/wiki/Sintering",
  },
  ndfeb: {
    term: "NdFeB — Neodymium-Iron-Boron",
    explanation:
      "The strongest type of permanent magnet commercially available. Made from an alloy of neodymium (a rare-earth metal), iron, and boron. First developed in 1984, NdFeB magnets are used in electric motors (EVs, hard drives), speakers, MRI machines, and wind turbine generators. Their main weakness is susceptibility to corrosion and demagnetization at elevated temperatures.",
    wikiUrl: "https://en.wikipedia.org/wiki/Neodymium_magnet",
  },
  smco: {
    term: "SmCo — Samarium-Cobalt",
    explanation:
      "A rare-earth permanent magnet made from samarium and cobalt. Less powerful than NdFeB by energy product, but with superior high-temperature performance (up to 350 °C), excellent corrosion resistance (often needs no coating), and better long-term stability. Significantly more expensive than NdFeB due to cobalt costs and lower production volumes. Used in aerospace, military, and high-reliability applications.",
    wikiUrl: "https://en.wikipedia.org/wiki/Samarium%E2%80%93cobalt_magnet",
  },
  ferrite: {
    term: "Hard Ferrite (Ceramic Magnet)",
    explanation:
      "A permanent magnet made from iron oxide (Fe₂O₃) combined with barium carbonate (BaFe) or strontium carbonate (SrFe). By far the cheapest magnet material — the raw powder costs roughly 50× less than NdFeB alloy. Much weaker than rare-earth magnets but resistant to corrosion, non-conducting, and widely used in motors, sensors, loudspeakers, and refrigerator door seals.",
    wikiUrl: "https://en.wikipedia.org/wiki/Ferrite_(magnet)",
  },
  alnico: {
    term: "AlNiCo",
    explanation:
      "An alloy of aluminum, nickel, cobalt, and iron — one of the earliest engineered permanent magnet materials, developed in the 1930s. Has exceptional temperature stability (rated to 450–550 °C) and good corrosion resistance, but very low coercivity, meaning it demagnetizes easily if exposed to opposing magnetic fields. Used in guitar pickups, sensors, loudspeakers, and instruments. Produced in much lower volumes than NdFeB or ferrite.",
    wikiUrl: "https://en.wikipedia.org/wiki/Alnico",
  },
  remanence: {
    term: "Remanence (Br)",
    explanation:
      "The magnetic flux density remaining in a fully magnetized permanent magnet after the external magnetizing field has been removed. Measured in Tesla (T). Higher Br means a stronger magnet at its poles. For reference: ferrite grades reach ~0.4 T; NdFeB N52 reaches ~1.43 T — over 3× stronger.",
    wikiUrl: "https://en.wikipedia.org/wiki/Remanence",
  },
  coercivity: {
    term: "Intrinsic Coercivity (Hci)",
    explanation:
      "The resistance of a magnet to becoming demagnetized by an opposing magnetic field or by heat. Measured in kA/m (or Oersteds). A higher Hci means the magnet can survive stronger opposing fields and higher temperatures before losing its magnetization. NdFeB grades with SH/UH/EH suffixes have elevated coercivity achieved by adding dysprosium.",
    wikiUrl: "https://en.wikipedia.org/wiki/Coercivity",
  },
  grade: {
    term: "Magnet Grade",
    explanation:
      "A standardized designation that describes magnet performance. For NdFeB, the number (e.g. N42) indicates the maximum energy product in MGOe — higher numbers mean a stronger magnet. The letter suffix indicates temperature rating: no suffix = standard (80 °C max), M = medium, H = high, SH = super-high (150 °C), UH = ultra-high (180 °C), EH = extreme-high (200 °C). These high-temp grades achieve their performance by adding dysprosium, which increases cost.",
    wikiUrl: "https://en.wikipedia.org/wiki/Neodymium_magnet#Grades",
  },
  energyProduct: {
    term: "Maximum Energy Product (BHmax)",
    explanation:
      "The key figure of merit for comparing permanent magnets, measured in MGOe (Mega-Gauss-Oersteds) or kJ/m³. It represents the maximum magnetic energy density the material can store in its gap — roughly how much work the magnet can do. The N-number in NdFeB grades directly refers to this: N42 has a BHmax of 42 MGOe. Ferrite C8 is ~8 MGOe; N52 is the current commercial ceiling at ~52 MGOe.",
    wikiUrl: "https://en.wikipedia.org/wiki/Permanent_magnet#Magnet_performance",
  },
  feedstock: {
    term: "Feedstock",
    explanation:
      "The raw alloy material — typically an ingot, strip-cast flake, or jet-milled powder — that gets pressed and sintered into finished magnets. For NdFeB, feedstock is a Nd-Fe-B alloy. Feedstock cost is the single largest cost driver for rare-earth magnets because neodymium and cobalt are expensive traded commodities with prices set by mining output and downstream demand from EVs and wind turbines.",
    wikiUrl: null,
  },
  yieldPct: {
    term: "Yield %",
    explanation:
      "The fraction of input feedstock mass that becomes a saleable finished part. Losses happen at multiple stages: die pressing (flash and trim scrap), sintering shrinkage (~15–20% linear), slicing and dicing (saw kerf), and parts that fail dimensional or magnetic inspection. A yield of 82% means that for every 1.22 kg of alloy you buy, you get 1 kg of shipped magnets.",
    wikiUrl: null,
  },
  toleranceClass: {
    term: "Tolerance Class",
    explanation:
      "How precisely the finished part dimensions must match the drawing. Sintered magnets come out of the oven with dimensional scatter of ±0.2–0.5 mm. Tighter tolerances require post-sinter surface grinding, which adds time, tooling wear, and grinding scrap. Standard (±0.1 mm) is often achievable with light grinding; Ultra (±0.02 mm) requires precision surface grinding on all faces.",
    wikiUrl: "https://en.wikipedia.org/wiki/Engineering_tolerance",
  },
  coating: {
    term: "Surface Coating",
    explanation:
      "NdFeB magnets corrode rapidly in humid environments because neodymium oxidizes easily. A protective coating is almost always applied. The standard is Ni-Cu-Ni triple-layer electroplating: a copper interlayer provides adhesion between two nickel layers. Zinc is cheaper and suitable for mild environments. Epoxy spray-coating is good for humid/saltwater environments. Gold flash is used where solder-wetting or biocompatibility is needed.",
    wikiUrl: "https://en.wikipedia.org/wiki/Electroplating",
  },
  floorPrice: {
    term: "Floor Price",
    explanation:
      "The minimum viable selling price at a target gross margin. Selling below floor price means not covering overhead, SG&A, and profit. Here calculated at 35% gross margin: floor price = manufacturing cost ÷ (1 − 0.35) = cost ÷ 0.65. This is not the same as a market price — the market may be higher (competitive advantage) or lower (competitive pressure).",
    wikiUrl: null,
  },
  grossMargin: {
    term: "Gross Margin",
    explanation:
      "The percentage of revenue remaining after subtracting the direct cost of goods sold (COGS). A 35% gross margin means that for every $1.00 of revenue, $0.35 is available to cover operating expenses (rent, salaries, R&D) and profit. The remaining $0.65 goes to materials, processing, and coating.",
    wikiUrl: "https://en.wikipedia.org/wiki/Gross_margin",
  },
  rareEarth: {
    term: "Rare-Earth Elements",
    explanation:
      "A group of 17 metallic elements (the 15 lanthanides plus scandium and yttrium). Despite the name, most are not geologically rare — but economically viable deposits are concentrated in China, which dominates global production. Neodymium, praseodymium, samarium, and dysprosium are the key rare earths in permanent magnets. Supply chain concentration in China gives magnet pricing significant geopolitical sensitivity.",
    wikiUrl: "https://en.wikipedia.org/wiki/Rare-earth_element",
  },
  dysprosium: {
    term: "Dysprosium (Dy)",
    explanation:
      "A rare-earth element added to NdFeB grades requiring high-temperature performance (SH, UH, EH). Dysprosium dramatically improves coercivity by substituting for neodymium in the alloy crystal structure — but it costs ~$200–300/kg, roughly 3–4× the price of neodymium. High-temperature grades can contain 3–10 wt% Dy, making feedstock cost jump sharply compared to standard grades.",
    wikiUrl: "https://en.wikipedia.org/wiki/Dysprosium",
  },
  neodymium: {
    term: "Neodymium (Nd)",
    explanation:
      "The primary rare-earth element in NdFeB magnets, making up ~28–32 wt% of the alloy. Priced at ~$60–80/kg as a metal (2023–2024). Prices fluctuate significantly — they tripled between 2020 and 2022 driven by EV demand, then fell back. Because NdFeB is ~30% Nd by mass, a 10% swing in Nd price translates to roughly a 3% swing in feedstock cost.",
    wikiUrl: "https://en.wikipedia.org/wiki/Neodymium",
  },
  cobalt: {
    term: "Cobalt (Co)",
    explanation:
      "A critical metal used in both SmCo magnets (~35–65 wt% of the alloy) and as a minor addition in some NdFeB grades. Cobalt is primarily mined as a byproduct of copper and nickel mining, with ~70% of supply from the Democratic Republic of Congo. It's also used heavily in lithium-ion batteries, making it subject to supply pressure and price volatility. Currently ~$30–40/kg.",
    wikiUrl: "https://en.wikipedia.org/wiki/Cobalt",
  },
  batchPricing: {
    term: "Quantity Tier Pricing",
    explanation:
      "Magnet pricing varies dramatically with quantity because fixed costs (tooling, setup, programming, quality documentation) are amortized over fewer parts at low volumes. A single prototype run may require a minimum charge of $200–500 regardless of part count, making per-piece cost extremely high. Production runs spread these costs over thousands of parts. The multipliers here are typical but actual quotes vary widely by supplier.",
    wikiUrl: null,
  },
  processingCost: {
    term: "Processing Cost",
    explanation:
      "The per-kg cost of converting alloy feedstock into a finished sintered magnet, covering: jet milling the alloy to fine powder, die pressing or isostatic pressing, vacuum sintering, annealing, slicing to shape, and inspection. Does not include the coating step. Processing costs vary dramatically by geography — Chinese integrated factories operate at $5–15/kg for NdFeB; Western or Japanese facilities are 2–5× higher.",
    wikiUrl: null,
  },
};

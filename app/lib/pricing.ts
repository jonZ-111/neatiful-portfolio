// neatiful Pricing Engine — PORTFOLIO VERSION
//
// All rates in this file are PLACEHOLDERS for demonstration only. They are
// not neatiful's real prices. The production version lives in a private
// repository owned by Orivallis LLC; this copy keeps the same structure and
// logic so the estimate calculator can be reviewed and run.
//
// Design: this file is the single source of truth for every rate used by
// the Estimate Calculator. In production it mirrors the company's internal
// pricing spreadsheet exactly, so the website and the CRM never disagree.

export type ManualQuoteReason =
  | "intensive_condition"
  | "tall_ceilings"
  | "organization_no_package"
  | "garage_hours"
  | null;

export interface EstimateResult {
  total: number;
  breakdown: { label: string; amount: number }[];
  manualQuote: ManualQuoteReason;
  note?: string;
}

// ---------- Interpolation helper (used by all breakpoint tables) ----------
// Prices are defined at fixed square-footage breakpoints. Anything between
// two breakpoints is linearly interpolated; anything past the last one
// extends the final segment's slope; anything below the first scales down
// proportionally.
function interpolate(sizes: number[], values: number[], x: number): number {
  if (x <= sizes[0]) return values[0] * (x / sizes[0]);
  const n = sizes.length;
  if (x >= sizes[n - 1]) {
    const slope = (values[n - 1] - values[n - 2]) / (sizes[n - 1] - sizes[n - 2]);
    return values[n - 1] + slope * (x - sizes[n - 1]);
  }
  for (let i = 0; i < n - 1; i++) {
    if (x >= sizes[i] && x <= sizes[i + 1]) {
      const t = (x - sizes[i]) / (sizes[i + 1] - sizes[i]);
      return values[i] + t * (values[i + 1] - values[i]);
    }
  }
  return values[n - 1];
}

// Used by tables that price at exact tiers instead of interpolating.
function nearestIndex(sizes: number[], x: number): number {
  let closest = 0;
  let closestDiff = Infinity;
  sizes.forEach((s, i) => {
    const diff = Math.abs(s - x);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = i;
    }
  });
  return closest;
}

// ---------- MAIN PRODUCT: Deep Cleaning ----------
// One-time deep clean, or an initial deep clean discounted for customers
// who sign up for recurring service (recurring visits are then priced as
// Standard/Regular Cleaning).
export const deepCleaning = {
  sizes: [500, 1000, 1500, 2000, 2500, 3000, 3600, 4000, 4500, 5000, 5500, 6000],
  oneTime: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650],
  sixMoContract: [80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520],
};

export type DeepCleaningFrequency = "onetime" | "sixmo";

export function getDeepCleaningPrice(sqft: number, freq: DeepCleaningFrequency): number {
  const map: Record<DeepCleaningFrequency, number[]> = {
    onetime: deepCleaning.oneTime,
    sixmo: deepCleaning.sixMoContract,
  };
  return interpolate(deepCleaning.sizes, map[freq], sqft);
}

// ---------- MAIN PRODUCT: Standard/Regular Cleaning ----------
// One-time price plus recurring frequencies, where more frequent visits
// cost less per visit.
export const standardRegular = {
  sizes: [500, 1000, 1500, 2000, 2500, 3000, 3600, 4000, 4500, 5000, 5500, 6000],
  oneTime65: [70, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 400],
  threeXWeek: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
  twoXWeek: [35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145],
  weekly: [50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270],
  biweekly: [55, 80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330],
  monthly: [60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390],
};

export type StandardFrequency = "onetime" | "3xweek" | "2xweek" | "weekly" | "biweekly" | "monthly";

export function getStandardPrice(sqft: number, freq: StandardFrequency): number {
  const map: Record<StandardFrequency, number[]> = {
    onetime: standardRegular.oneTime65,
    "3xweek": standardRegular.threeXWeek,
    "2xweek": standardRegular.twoXWeek,
    weekly: standardRegular.weekly,
    biweekly: standardRegular.biweekly,
    monthly: standardRegular.monthly,
  };
  return interpolate(standardRegular.sizes, map[freq], sqft);
}

// ---------- MAIN PRODUCT: Move In / Move Out ----------
export const moveInOut = {
  sizes: [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000],
  deep: [120, 170, 220, 270, 320, 370, 420, 470, 520, 570, 620, 670],
  standard: [100, 145, 190, 235, 280, 325, 370, 415, 460, 505, 550, 595],
  realtor: [90, 130, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530],
};

export type MoveInOutTier = "deep" | "standard" | "realtor";

export function getMoveInOutPrice(sqft: number, tier: MoveInOutTier): number {
  return interpolate(moveInOut.sizes, moveInOut[tier], sqft);
}

// ---------- MAIN PRODUCT: Office Cleaning (exact tiers, nearest match) ----------
// Commercial pricing uses fixed tiers: the calculator picks the nearest
// tier rather than interpolating.
export const office = {
  sizes: [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000],
  initialDeep: [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000],
  twoXWeek: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210],
  onceWeek: [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400],
  every2wk: [70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 370, 390, 410],
  every4wk: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420],
  monthlyMedical: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200],
  monthlyRegular: [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100],
};

export type OfficeFrequency = "initialDeep" | "2xweek" | "onceweek" | "every2wk" | "every4wk" | "monthlyMedical" | "monthlyRegular";

export function getOfficePrice(sqft: number, freq: OfficeFrequency): { price: number; matchedTier: number } {
  const map: Record<OfficeFrequency, number[]> = {
    initialDeep: office.initialDeep,
    "2xweek": office.twoXWeek,
    onceweek: office.onceWeek,
    every2wk: office.every2wk,
    every4wk: office.every4wk,
    monthlyMedical: office.monthlyMedical,
    monthlyRegular: office.monthlyRegular,
  };
  const idx = nearestIndex(office.sizes, sqft);
  return { price: map[freq][idx], matchedTier: office.sizes[idx] };
}

// ---------- MAIN PRODUCT: Post-Construction (pure per sq ft) ----------
export const postConstructionRates = {
  finalDeep: 0.3,
  rough: 0.2,
  touchUp: 0.1,
};

export type PostConstructionStage = "finalDeep" | "rough" | "touchUp";

export function getPostConstructionPrice(sqft: number, stage: PostConstructionStage): number {
  return sqft * postConstructionRates[stage];
}

// ---------- MAIN PRODUCT: Carpet Cleaning (pure per sq ft) ----------
export const carpetRates = {
  standard: 0.2,
  deep: 0.3,
};

export type CarpetTier = "standard" | "deep";

export function getCarpetPrice(sqft: number, tier: CarpetTier): number {
  return sqft * carpetRates[tier];
}

// ---------- MAIN PRODUCT: Airbnb Turnover ----------
// Base package covers 1 bedroom, 1 bathroom, and common areas, with a
// per-room charge beyond that and a discount for hosts with several
// enrolled properties.
export const airbnbTurnover = {
  baseRate: 100,
  perAdditionalBedroom: 20,
  perAdditionalBathroom: 20,
};

export type AirbnbPropertyTier = "single" | "multi2to4" | "multi5plus";

export const airbnbMultiPropertyDiscount: Record<AirbnbPropertyTier, number> = {
  single: 0,
  multi2to4: 0.05,
  multi5plus: 0.1,
};

export function getAirbnbTurnoverPrice(
  bedrooms: number,
  bathrooms: number,
  propertyTier: AirbnbPropertyTier
): number {
  const extraBedrooms = Math.max(0, bedrooms - 1);
  const extraBathrooms = Math.max(0, bathrooms - 1);
  const subtotal =
    airbnbTurnover.baseRate +
    extraBedrooms * airbnbTurnover.perAdditionalBedroom +
    extraBathrooms * airbnbTurnover.perAdditionalBathroom;
  const discount = airbnbMultiPropertyDiscount[propertyTier];
  return subtotal * (1 - discount);
}

// ---------- ADD-ONS: Cleaning ----------
export const cleaningAddOns = {
  fridge: 20,
  oven: 20,
  cabinets: 30,
  windowPerPane: 5,
  wallCleaningPerRoom: 20, // manual quote if ceilings are unusually tall
};

// ---------- ADD-ONS: Decluttering and Organization ----------
// Universal rule: the flat rate covers the first 2 hours.
// Each full hour past hour 2 adds +50% of the flat rate, cumulative.
// Hours are always chosen by the client.
export const organizationAddOns = {
  cabinetsOnly: 20,
  fridgeOnly: 20,
  homeOffice: 30,
  closetSpace: 30,
  laundryRoom: 30, // space & systems only — not washing/drying/folding
  furnitureArrangement: 30,
  garage: 40,
  kidsPlayroom: 30,
};

export function getOrganizationPrice(flatRate: number, hours: number): EstimateResult {
  let total = flatRate;
  const breakdown = [{ label: `Base (first 2 hours)`, amount: flatRate }];

  if (hours > 2) {
    const extraHours = Math.floor(hours - 2);
    for (let h = 1; h <= extraHours; h++) {
      const addition = flatRate * 0.5;
      total += addition;
      breakdown.push({ label: `Hour ${2 + h}`, amount: addition });
    }
  }

  return { total, breakdown, manualQuote: null };
}

// ---------- Manual-quote flags ----------
// The most severe condition level always requires an individual assessment
// instead of an automatic price.
export function isIntensiveCondition(conditionAnswer: string): boolean {
  return conditionAnswer.toLowerCase().includes("intensive");
}

// ---------- Space Condition Multiplier ----------
// Applied on top of the selected service: condition changes how much work a
// service takes, not which service applies. "Intensive" is excluded on
// purpose; it routes to a manual quote instead (see isIntensiveCondition).
export type SpaceCondition = "light" | "standard" | "moderate" | "heavy";

export const spaceConditionMultipliers: Record<SpaceCondition, number> = {
  light: 0.9,
  standard: 1.0,
  moderate: 1.2,
  heavy: 1.4,
};

export function applyConditionMultiplier(basePrice: number, condition: SpaceCondition): number {
  return basePrice * spaceConditionMultipliers[condition];
}

export const conditionToNumber: Record<SpaceCondition | "intensive", number> = {
  light: 1,
  standard: 2, // internal key stays "standard"; display label is "Everyday Condition"
  moderate: 3,
  heavy: 4,
  intensive: 5,
};

export const conditionLabels: Record<SpaceCondition | "intensive", string> = {
  light: "Light Upkeep — Regularly maintained, with light dust and little or no visible buildup.",
  standard: "Everyday Condition — Normal dust, crumbs, light marks, and minor kitchen or bathroom buildup.",
  moderate: "Moderate Buildup — Visible grime, soap scum, grease, pet hair, or several areas requiring extra attention.",
  heavy: "Heavy Buildup — Significant grease, grime, staining, or accumulated dirt throughout multiple areas.",
  intensive: "Intensive Condition — Extensive buildup, strong odors, severe staining, or substantial clutter requiring an individual assessment.",
};

export function getConditionFullLabel(condition: SpaceCondition | "intensive"): string {
  return `${conditionToNumber[condition]}. ${conditionLabels[condition]}`;
}

// ---------- ZIP Code / Travel Fee ----------
// A flat travel fee applies to jobs outside the core service area, rather
// than graduated ZIP-based pricing.
//
// AUSTIN_METRO_ZIPS is the official USPS list of ZIP codes whose City/Town
// is "Austin". Note: some ZIPs commonly called by suburb names (e.g.,
// Lakeway 78734/78738 and West Lake Hills 78746) are officially Austin per
// USPS, so they're treated as core, not suburb.
//
// SURROUNDING_SUBURB_ZIPS have a distinct official City/Town value.
// PROXIMITY_CORE_ZIPS are officially separate towns treated as core because
// they're adjacent to Austin — kept in their own list so the difference
// between official data and a business judgment call stays traceable.
//
// HOUSTON_METRO_PREFIXES is a prefix approximation, to be replaced with an
// official per-ZIP list the same way Austin's was.
export const AUSTIN_METRO_ZIPS = [
  "73301", "73344",
  "78701", "78702", "78703", "78704", "78705",
  "78708", "78709", "78710", "78711", "78712", "78713", "78714", "78715",
  "78716", "78717", "78718", "78719", "78720", "78721", "78722", "78723",
  "78724", "78725", "78726", "78727", "78728", "78729", "78730", "78731",
  "78732", "78733", "78734", "78735", "78736", "78737", "78738", "78739",
  "78741", "78742", "78744", "78745", "78746", "78747", "78748", "78749",
  "78750", "78751", "78752", "78753", "78754", "78755", "78756", "78757",
  "78758", "78759", "78760", "78761", "78762", "78763", "78764", "78765",
  "78766", "78767", "78768", "78772", "78773", "78774", "78778", "78779",
  "78783", "78799",
];

export const SURROUNDING_SUBURB_ZIPS = [
  "78610", // Buda
  "78613", // Cedar Park
  "78641", // Leander
  "78652", // Manchaca
  "78653", // Manor
  "78660", // Pflugerville
  "78664", "78665", "78681", // Round Rock
  "78669", // Spicewood
];

export const PROXIMITY_CORE_ZIPS = [
  "78617", // Del Valle — officially separate, but adjacent to Austin
];

export const HOUSTON_METRO_PREFIXES = ["770", "771", "772", "773", "774", "775"];

export const OUTSIDE_AREA_TRAVEL_FEE = 25;

export function isCoreServiceZip(zip: string): boolean {
  const cleaned = zip.trim();
  if (AUSTIN_METRO_ZIPS.includes(cleaned)) return true;
  if (PROXIMITY_CORE_ZIPS.includes(cleaned)) return true;
  if (SURROUNDING_SUBURB_ZIPS.includes(cleaned)) return false;
  const prefix = cleaned.slice(0, 3);
  return HOUSTON_METRO_PREFIXES.includes(prefix);
}

export function getTravelFee(zip: string): number {
  if (!zip || zip.trim() === "") return 0;
  return isCoreServiceZip(zip) ? 0 : OUTSIDE_AREA_TRAVEL_FEE;
}

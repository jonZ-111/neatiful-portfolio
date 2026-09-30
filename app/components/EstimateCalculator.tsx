"use client";

import {  useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConditionGuide from "./ConditionGuide";  
import {
  getDeepCleaningPrice,
  getStandardPrice,
  getMoveInOutPrice,
  getOfficePrice,
  getPostConstructionPrice,
  getCarpetPrice,
  getOrganizationPrice,
  cleaningAddOns,
  organizationAddOns,
  DeepCleaningFrequency,
  StandardFrequency,
  MoveInOutTier,
  OfficeFrequency,
  PostConstructionStage,
  CarpetTier,
  SpaceCondition,
  applyConditionMultiplier,
  getConditionFullLabel,
  isIntensiveCondition,
  getTravelFee,
} from "../lib/pricing";
import { ESTIMATE_WEBHOOK_URL, WEBHOOK_CONFIGURED } from "../lib/config";

type MainProduct =
  | "deepCleaning"
  | "standardRegular"
  | "moveInOut"
  | "office"
  | "postConstruction"
  | "carpet";

type AddOnKey =
  | "fridge"
  | "oven"
  | "cabinets"
  | "windows"
  | "wallCleaning"
  | "fridgeCleanOrganize"
  | "cabinetsCleanOrganize"
  | "orgCabinets"
  | "orgFridge"
  | "orgHomeOffice"
  | "orgLaundryRoom"
  | "orgClosetSpace"
  | "orgFurniture"
  | "orgGarage"
  | "orgKidsPlayroom";

interface Breakdown {
  label: string;
  amount: number;
}

const PRODUCT_LABELS: Record<MainProduct, string> = {
  deepCleaning: "Deep Cleaning",
  standardRegular: "Standard/Regular Cleaning",
  moveInOut: "Move In / Move Out",
  office: "Office Cleaning",
  postConstruction: "Post-Construction Cleaning",
  carpet: "Carpet Cleaning",
};

const HOURLY_ADDON_KEYS: AddOnKey[] = [
  "orgHomeOffice",
  "orgLaundryRoom",
  "orgClosetSpace",
  "orgFurniture",
  "orgGarage",
  "orgKidsPlayroom"
];

export default function EstimateCalculator() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service");
  const validInitialService: MainProduct | "" =
    initialService && Object.keys(PRODUCT_LABELS).includes(initialService)
      ? (initialService as MainProduct)
      : "";
  const [product, setProduct] = useState<MainProduct | "">(validInitialService);  
  const [sqft, setSqft] = useState<number | "">("");
  const [condition, setCondition] = useState<SpaceCondition | "intensive" | "">("");
  const [zip, setZip] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [preferredContact, setPreferredContact] = useState<string>("");

  const [deepFreq, setDeepFreq] = useState<DeepCleaningFrequency>("onetime");
  const [standardFreq, setStandardFreq] = useState<StandardFrequency>("weekly");
  const [moveTier, setMoveTier] = useState<MoveInOutTier>("standard");
  const [officeFreq, setOfficeFreq] = useState<OfficeFrequency>("onceweek");
  const [pcStage, setPcStage] = useState<PostConstructionStage>("finalDeep");
  const [carpetTier, setCarpetTier] = useState<CarpetTier>("standard");

  const [selectedAddOns, setSelectedAddOns] = useState<Set<AddOnKey>>(new Set());
  const [windowPanes, setWindowPanes] = useState<number>(1);
  const [wallRooms, setWallRooms] = useState<number>(1);
  const [tallCeilings, setTallCeilings] = useState(false);
  const [addOnHours, setAddOnHours] = useState<Record<string, number>>({});

  // Contact capture — only collected/sent once the customer chooses to send
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactZip, setContactZip] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const [sentName, setSentName] = useState<string>("");
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  function toggleAddOn(key: AddOnKey) {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const result = useMemo(() => {
    const breakdown: Breakdown[] = [];
    let manualQuoteNote: string | null = null;

    // Don't calculate anything until the customer has actually made real choices —
    // showing a price before they've interacted would look like it's their price.
        if (product === "") {
            return { total: 0, breakdown: [], manualQuoteNote: null, incomplete: true };
        }
        if (sqft === "" || sqft <= 0) {
            return { total: 0, breakdown: [], manualQuoteNote: null, incomplete: true };
        }
        if (condition === "") {
            return { total: 0, breakdown: [], manualQuoteNote: null, incomplete: true };
        }

    // Space Condition tier 5 ("Intensive condition") always routes to manual quote,
    // before any price calculation happens — matches the form's own question text.
        if (condition === "intensive") {
            return {
                total: 0,
                breakdown: [],
                manualQuoteNote:
                    "This condition level requires an individual assessment. Please send us your details below and a neatiful representative will provide a custom quote.",
                incomplete: false,
            };
        }

    // Main product
    let mainPrice = 0;
    let mainLabel = "";
    if (product === "deepCleaning") {
      mainPrice = getDeepCleaningPrice(sqft, deepFreq);
      mainLabel = `Deep Cleaning (${sqft} sq ft)`;
    } else if (product === "standardRegular") {
      mainPrice = getStandardPrice(sqft, standardFreq);
      mainLabel = `Standard/Regular Cleaning (${sqft} sq ft)`;
    } else if (product === "moveInOut") {
      mainPrice = getMoveInOutPrice(sqft, moveTier);
      mainLabel = `Move In/Out — ${moveTier} (${sqft} sq ft)`;
    } else if (product === "office") {
      const officeResult = getOfficePrice(sqft, officeFreq);
      mainPrice = officeResult.price;
      mainLabel = `Office Cleaning (nearest tier: ${officeResult.matchedTier} sq ft)`;
    } else if (product === "postConstruction") {
      mainPrice = getPostConstructionPrice(sqft, pcStage);
      mainLabel = `Post-Construction (${sqft} sq ft)`;
    } else if (product === "carpet") {
      mainPrice = getCarpetPrice(sqft, carpetTier);
      mainLabel = `Carpet Cleaning — ${carpetTier} (${sqft} sq ft)`;
    }

    // Space Condition multiplier only applies to general home cleaning products —
    // Office, Post-Construction, and Carpet already have their own intensity/stage
    // selection, so an additional condition multiplier would double-count effort.
    const conditionAppliesTo: MainProduct[] = ["deepCleaning", "standardRegular", "moveInOut"];
    if (conditionAppliesTo.includes(product) && condition !== "standard") {
      const adjusted = applyConditionMultiplier(mainPrice, condition);
      breakdown.push({ label: mainLabel, amount: mainPrice });
      breakdown.push({ label: `Space condition adjustment (${condition})`, amount: adjusted - mainPrice });
      mainPrice = adjusted;
    } else {
      breakdown.push({ label: mainLabel, amount: mainPrice });
    }

    let total = mainPrice;

    // Travel fee — flat fee for ZIPs outside the approximate core service area
    const travelFee = getTravelFee(zip);
    if (travelFee > 0) {
      total += travelFee;
      breakdown.push({ label: "Outside core service area — travel fee", amount: travelFee });
    }

    // Cleaning add-ons
    if (selectedAddOns.has("fridge")) {
      total += cleaningAddOns.fridge;
      breakdown.push({ label: "Fridge - Interior Wiping and Disinfecting", amount: cleaningAddOns.fridge });
    }
    if (selectedAddOns.has("oven")) {
      total += cleaningAddOns.oven;
      breakdown.push({ label: "Oven - Interior Wiping and Disinfecting", amount: cleaningAddOns.oven });
    }
    if (selectedAddOns.has("cabinets")) {
      total += cleaningAddOns.cabinets;
      breakdown.push({ label: "Cabinets - Interior Wiping and Disinfecting", amount: cleaningAddOns.cabinets });
    }

    if (selectedAddOns.has("windows")) {
      const amt = cleaningAddOns.windowPerPane * windowPanes;
      total += amt;
      breakdown.push({ label: `Windows (${windowPanes} pane${windowPanes !== 1 ? "s" : ""})`, amount: amt });
    }
    if (selectedAddOns.has("wallCleaning")) {
      if (tallCeilings) {
        manualQuoteNote = "Wall Cleaning with tall/vaulted ceilings needs a manual quote — flat rate doesn't apply.";
      } else {
        const amt = cleaningAddOns.wallCleaningPerRoom * wallRooms;
        total += amt;
        breakdown.push({ label: `Wall Cleaning (${wallRooms} room${wallRooms !== 1 ? "s" : ""})`, amount: amt });
      }
    }

    // Decluttering & Organization add-ons (flat covers 2 hrs, +50%/hr after, client-directed)
    const orgMap: { key: AddOnKey; flat: number; label: string; hourly: boolean }[] = [
      { key: "orgCabinets", flat: organizationAddOns.cabinetsOnly, label: "Cabinets (Decluttering & Organization)", hourly: false },
      { key: "orgFridge", flat: organizationAddOns.fridgeOnly, label: "Fridge (Decluttering & Organization)", hourly: false },
      { key: "orgHomeOffice", flat: organizationAddOns.homeOffice, label: "Home Office (Decluttering & Organization)", hourly: true },
      { key: "orgLaundryRoom", flat: organizationAddOns.laundryRoom, label: "Laundry Room (space & systems only)", hourly: true },
      { key: "orgClosetSpace", flat: organizationAddOns.closetSpace, label: "Closet (Bedroom, Hall, Coat)", hourly: true },
      { key: "orgFurniture", flat: organizationAddOns.furnitureArrangement, label: "Living Room & Common Areas", hourly: true },
      { key: "orgGarage", flat: organizationAddOns.garage, label: "Garage & Storage", hourly: true },
      { key: "orgKidsPlayroom", flat: organizationAddOns.kidsPlayroom, label: "Kids' Rooms & Playroom", hourly: true },
    ];

    orgMap.forEach(({ key, flat, label, hourly }) => {
      if (!selectedAddOns.has(key)) return;
      if (hourly) {
        const hours = addOnHours[key] ?? 2;
        const orgResult = getOrganizationPrice(flat, hours);
        total += orgResult.total;
        breakdown.push({ label: `${label} (${hours} hrs)`, amount: orgResult.total });
      } else {
        total += flat;
        breakdown.push({ label, amount: flat });
      }
    });

    const roundedBreakdown = breakdown.map((row) => ({ 
      ...row, amount: Math.round(row.amount * 100) / 100,
    }));
    const roundedTotal = Math.round(total * 100) / 100;

    return { total: roundedTotal, breakdown: roundedBreakdown, manualQuoteNote, incomplete: false };

  }, [
    product,
    sqft,
    condition,
    zip,
    deepFreq,
    standardFreq,
    moveTier,
    officeFreq,
    pcStage,
    carpetTier,
    selectedAddOns,
    windowPanes,
    wallRooms,
    tallCeilings,
    addOnHours,
  ]);

   const canSubmit = contactName.trim() !== "" && /^\d{5}$/.test(contactZip) && (contactPhone.trim() !== "" || contactEmail.trim() !== "");

    const formComplete =
      product !== "" &&
      sqft !== "" &&
      sqft > 0 &&
      condition !== "" &&
      zip.trim() !== "" &&
      propertyType !== "" &&
      preferredContact !== "";

  // Deep Cleaning and Move In/Out — Deep tier already include a full
  // appliance/cabinet clean in their base price, so the plain Fridge/Oven/
  // Cabinets add-ons would double-charge for something already covered.

  const includedApplianceAddOns = product === "deepCleaning" || (product === "moveInOut" && moveTier === "deep");

  async function handleSendEstimate() {
    if (!canSubmit || result.manualQuoteNote || product === "" || condition === "") return;
    setSubmitStatus("sending");
    setSubmitError("");

    const payload = {
      submittedAt: new Date().toISOString(),
      contact: {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        zip: contactZip,
      },
      service: PRODUCT_LABELS[product],
      condition: getConditionFullLabel(condition),
      propertyType,
      preferredContact,
      sqft,
      estimateTotal: result.total,
      breakdown: result.breakdown,         
      source: "website-calculator",
    };

    if (!WEBHOOK_CONFIGURED) {
      setSubmitStatus("error");
      setSubmitError("We're having trouble sending this automatically. Please send an email to hello@neatifulliving.com with your estimate details, and we'll take it from there.");
      return;
    }

    try {
      const res = await fetch(ESTIMATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSubmitStatus("sent");
      setSentName(contactName);

    } catch (err) {
      setSubmitStatus("error");
      setSubmitError("Something went wrong sending your estimate. Please call or email us directly.");
    }
  }

  return (
    <div className="estimate-calc">
        <div className="estimate-calc-card">
          <label className="estimate-calc-label">Service</label>
          <select
            className="estimate-calc-select"
            value={product}
            onChange={(e)=> {
              const newProduct = e.target.value as MainProduct | "";
              setProduct(newProduct);
              if (newProduct === "deepCleaning" || (newProduct === "moveInOut" && moveTier === "deep")) {
                setSelectedAddOns((prev) => {
                  const next = new Set(prev);
                    next.delete("fridge");
                    next.delete("oven");
                    next.delete("cabinets");
                    next.delete("windows");
                    return next;
                  });
                }
              }
            }
          >
            <option value="" disabled>
              Select a service
            </option>
            {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label className="estimate-calc-label">Square Footage</label>
          <input
            type="number"
            className="estimate-calc-input"
            value={sqft}
            min={100}
            step={50}
            placeholder="Enter square footage"
            onChange={(e) => {
              const val = e.target.value;
              setSqft(val === "" ? "" : parseFloat (val) || 0);
            }}
          />

          <label className="estimate-calc-label">Current Condition of the Space</label>
          <p className="estimate-calc-hint">
            Consider all areas you&apos;re requesting service for — including any add-ons like Fridge,
            Oven, Cabinet interiors, or Windows, not just general surface dust. This helps us bring the
            right supplies and schedule enough time on the first visit.
          </p>          
          <select
            className="estimate-calc-select"
            value={condition}
            onChange={(e) => setCondition(e.target.value as SpaceCondition | "intensive" | "")}
            >
            <option value="" disabled> Select condition </option>  
            <option value="light">Light upkeep — regularly maintained</option>
            <option value="standard">Everyday Condition — normal dust, light marks</option>
            <option value="moderate">Moderate buildup — visible grime, several areas need attention</option>
            <option value="heavy">Heavy buildup — significant grease/grime, multiple areas</option>
            <option value="intensive">Intensive condition — extensive buildup, strong odors, requires assessment</option>
          </select>
          <ConditionGuide />

          <label className="estimate-calc-label">ZIP Code</label>
          <input
            type="text"
            className="estimate-calc-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="787XX or 770XX"
          />
          <p className="estimate-calc-hint">
            A flat travel fee applies outside our core Austin/Houston service area.
          </p>

          <label className="estimate-calc-label">Property Type</label>
            <select
              className="estimate-calc-select"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="" disabled>
                Select Property type
              </option>        
              <option value="house">House</option>
              <option value="apartment">Apartment or Condo</option>
              <option value="townhome">Townhome</option>
              <option value="studio">Studio</option>
              <option value="Office">Office or Commercial Space</option>
              <option value="other">Other</option>
            </select>

          <label className="estimate-calc-label">Preferred Contact Method</label>
            <select
              className="estimate-calc-select"
              value={preferredContact}
              onChange={(e) => setPreferredContact(e.target.value)}
            >
              <option value="" disabled>
                Select preferred contact method
              </option>  
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>  

          {product === "deepCleaning" && (
            <>
              <label className="estimate-calc-label">Frequency</label>
              <select
                className="estimate-calc-select"
                value={deepFreq}
                onChange={(e) => setDeepFreq(e.target.value as DeepCleaningFrequency)}
              > 
                <option value="onetime">One-Time Deep Clean</option>
                <option value="sixmo">Initial Deep (w/ 6-Mo Recurring Signup)</option>
              </select>
              <p className="estimate-calc-hint">
                Choosing the 6-month signup? Ongoing recurring visits after this initial clean are priced under Standard/Regular Cleaning, not repeated here.
              </p>
            </>
          )}

          {product === "standardRegular" && (
            <>
              <label className="estimate-calc-label">Frequency</label>
              <select
                className="estimate-calc-select"
                value={standardFreq}
                onChange={(e) => setStandardFreq(e.target.value as StandardFrequency)}
              >
                <option value="onetime">One-Time Standard Clean</option>
                <option value="3xweek">3x per Week</option>
                <option value="2xweek">2x per Week</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </>
          )}

          {product === "moveInOut" && (
            <>
              <label className="estimate-calc-label">Cleaning Level</label>
              <select
                className="estimate-calc-select"
                value={moveTier}
                onChange={(e) => {
                  const newTier = e.target.value as MoveInOutTier;
                  setMoveTier(newTier);
                  if(newTier === "deep"){
                    setSelectedAddOns((prev) => {
                      const next = new Set(prev);
                      next.delete("fridge"); 
                      next.delete("oven");
                      next.delete("cabinets");
                      next.delete("windows");
                      return next;
                    })
                  }
                }}
              >
                <option value="deep">Deep Cleaning</option>
                <option value="standard">Standard Cleaning</option>
                <option value="realtor">Move Out/In Cleaning for Realtor</option>
              </select>
            </>
          )}

          {product === "office" && (
            <>
              <label className="estimate-calc-label">Frequency</label>
              <select
                className="estimate-calc-select"
                value={officeFreq}
                onChange={(e) => setOfficeFreq(e.target.value as OfficeFrequency)}
              >
                <option value="2xweek">2x per Week</option>
                <option value="onceweek">Once a Week</option>
                <option value="every2wk">Every 2 Weeks</option>
                <option value="every4wk">Every 4 Weeks</option>
                <option value="monthlyMedical">Flat Monthly — Medical Office</option>
                <option value="monthlyRegular">Flat Monthly — Regular Office</option>
              </select>
            </>
          )}

          {product === "postConstruction" && (
            <>
            <label className="estimate-calc-label">Project Stage</label>
              <select
                className="estimate-calc-select"
                value={pcStage}
                onChange={(e) => setPcStage(e.target.value as PostConstructionStage)}
              >
                <option value="finalDeep">Final Deep Clean (project finished)</option>
                <option value="rough">Rough Clean (project not done)</option>
                <option value="touchUp">After Final — Light Touch-Up</option>
              </select>
            </>
          )}

          {product === "carpet" && (
            <>
              <label className="estimate-calc-label">Carpet Cleaning Level</label>
              <select
                className="estimate-calc-select"
                value={carpetTier}
                onChange={(e) => setCarpetTier(e.target.value as CarpetTier)}
              >
              <option value="standard">Standard Steam Clean</option>
              <option value="deep">Deep Extraction</option>
              </select>
            </>
          )}
        </div>
      

        <div className="estimate-calc-cta">
        <button
          type="button"
          className="estimate-calc-btn"
          disabled={!formComplete}
          onClick={() => setShowEstimateModal(true)}
        >Get My Estimate
        </button>
        {!formComplete && (
          <p className="estimate-calc-hint">
            Please complete all fields above to see your estimate.
          </p>
        )}
        </div>    
      
        {showEstimateModal && (
          <div className="estimate-calc-modal-overlay" onClick={() => setShowEstimateModal(false)}>
            <div className="estimate-calc-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button"
                className="estimate-calc-modal-close" 
                onClick={() => setShowEstimateModal(false)}
                aria-label="Close">
                  ×
              </button>
              <h3 className="estimate-calc-modal-title">Thank you for taking the time in filling this form - here&apos;s your estimate             
              </h3>
            <div className="estimate-calc-card">
              <h3 className="estimate-calc-subheading">Add-Ons</h3>

            <details className="estimate-calc-addon-group">
              <summary className="estimate-calc-group-label">Cleaning</summary>
              {includedApplianceAddOns && (
                <p className="estimate-calc-hint">
                  These add-ons are already included in the base price of Deep Cleaning and Move In/Out — Deep tier.
                </p>
              )}
              {(
                [
                  ["fridge", "Fridge - Interior Wiping & Disinfecting"],
                  ["oven", "Oven - Interior Wiping & Disinfecting"],
                  ["cabinets", "Cabinets - Interior Wiping & Disinfecting"],
                ] as [AddOnKey, string][]
              ).map(([key, label]) => {
                const isIncluded = includedApplianceAddOns && (key === "fridge" || key === "oven" || key === "cabinets");
                  return (
                <div key={key}>
                  <label 
                    className="estimate-calc-checkbox-row"
                    style={isIncluded ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                  >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.has(key)}
                    disabled={isIncluded}
                    onChange={() => toggleAddOn(key)}
                  />
                  {label}
                  {isIncluded ? "(Included)" : ""}
                </label>
                {key === "oven" && (
                  <p className="estimate-calc-hint">
                    Includes wiping and disinfecting the exterior (door, handles, control panel) as well as the interior.
                  </p>
                )}
                {(key === "fridge" || key === "cabinets") && (
                  <p className="estimate-calc-hint">
                    {isIncluded
                      ? "Exterior and interior wiping & disinfecting are already included in this service."
                      : "Exterior wiping & disinfecting is already included in every service. This adds a full interior clean — items removed, surfaces disinfected, and returned to place."
                    }
                  </p>
                )}
              </div>
              );
            })}

              <label className="estimate-calc-checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedAddOns.has("windows")}
                  disabled={includedApplianceAddOns}
                  onChange={() => toggleAddOn("windows")}
                />
              Windows
              {includedApplianceAddOns ? " (Included)" : ""}
              </label>
              {selectedAddOns.has("windows") && (
                <input
                type="number"
                className="estimate-calc-input estimate-calc-input-sm"
                value={windowPanes}
                min={1}
                onChange={(e) => setWindowPanes(parseInt(e.target.value) || 1)}
                placeholder="# panes"
                />
              )}

              <label className="estimate-calc-checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedAddOns.has("wallCleaning")}
                  onChange={() => toggleAddOn("wallCleaning")}
                />
              Wall Cleaning
              </label>
              {selectedAddOns.has("wallCleaning") && (
                <>
                  <input
                    type="number"
                    className="estimate-calc-input estimate-calc-input-sm"
                    value={wallRooms}
                    min={1}
                    onChange={(e) => setWallRooms(parseInt(e.target.value) || 1)}
                    placeholder="# rooms"
                  />
                  <label className="estimate-calc-checkbox-row">
                    <input
                      type="checkbox"
                      checked={tallCeilings}
                      onChange={(e) => setTallCeilings(e.target.checked)}
                    />
                    Unusually tall / vaulted ceilings
                  </label>
                </>
              )}
            </details>

        <details className="estimate-calc-addon-group">
          <summary className="estimate-calc-group-label">Decluttering &amp; Organization</summary>
          <p className="estimate-calc-hint">
              Built for everyday clutter and disorganization — a chaotic garage, an overflowing closet, a pantry
              that&apos;s stopped making sense. For homes with more significant accumulation, safety concerns, or
              conditions that need specialized care, we&apos;ll always be upfront with you and can point you toward
              the right kind of help.
          </p>
          <p className="estimate-calc-hint">
            Flat rate covers the first 2 hours. Each hour past 2 adds 50% of the base price. You decide how much time to book.
          </p>
          {(
            [
              ["orgCabinets", "Kitchen Cabinets & Pantry", false],
              ["orgFridge", "Refrigerator", false],
              ["orgHomeOffice", "Home Office & Paper Management", true],
              ["orgLaundryRoom", "Laundry Room", true],
              ["orgClosetSpace", "Closet (Bedroom, Hall, Coat)", true],
              ["orgFurniture", "Living & Common Areas", true],
              ["orgGarage", "Garage & Storage", true],
              ["orgKidsPlayroom", "Kids' Room & Playroom", true],
            ] as [AddOnKey, string, boolean][]
          ).map(([key, label, hourly]) => (
            <div key={key}>
              <label className="estimate-calc-checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedAddOns.has(key)}
                  onChange={() => toggleAddOn(key)}
                />
                {label}
              </label>
              {key === "orgLaundryRoom" && (
                <p className="estimate-calc-hint">
                  Organizing the space and systems only — doesn&apos;t include washing, drying, or folding your laundry loads.
                </p>
              )}
              {hourly && selectedAddOns.has(key) && (
                <input
                  type="number"
                  className="estimate-calc-input estimate-calc-input-sm"
                  value={addOnHours[key] ?? 2}
                  min={2}
                  step={0.5}
                  onChange={(e) =>
                    setAddOnHours((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 2 }))
                  }
                  placeholder="hours"
                />
              )}
            </div>
          ))}
        </details>
      </div>

      <div className="estimate-calc-result">
        {result.incomplete ? (
          <p className="estimate-calc-manual-note">
            Choose a service, enter your square footage, and select the space&apos;s condition above to see your estimate.
          </p>
        ) : result.manualQuoteNote ? (
          <p className="estimate-calc-manual-note">
            {result.manualQuoteNote}
          </p>
        ) : (
          <>
            <div className="estimate-calc-total">
              ${result.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="estimate-calc-total-sub">Estimated total — before tax</p>
          </>
        )}
        {!result.incomplete && (
        <div className="estimate-calc-breakdown">
          {result.breakdown.map((row, i) => (
            <div key={i} className="estimate-calc-breakdown-row">
              <span>{row.label}</span>
              <span>${row.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
        )}
        {!result.incomplete && (
        <p className="estimate-calc-disclaimer">
            This estimate already reflects the space condition and location you provided. Ready to book or, have questions about
            discounts, seasonal offers, or finding an option that fits your budget? Send it below — a neatiful
            representative is happy to talk it through with you.
        </p>
        )}
      </div>


      {!result.incomplete && !result.manualQuoteNote && (
        <div className="estimate-calc-card estimate-calc-contact-card">
          {submitStatus === "sent" ? (
            <div className="estimate-calc-sent-confirmation">
              <p className="estimate-calc-sent-title">Thanks, {sentName || "there"}!</p>
              <p>We&apos;ve received your estimate request. A neatiful representative will be in touch shortly — within the next 2-4 hours during business hours.</p>
            </div>
          ) : (
            <>
              <h3 className="estimate-calc-subheading">Send This Estimate to Our Team</h3>
              <p className="estimate-calc-hint">
                We&apos;ll only use this to follow up on your estimate — nothing is sent until you click the button below.
              </p>

              <label className="estimate-calc-label">Name</label>
              <input
                type="text"
                className="estimate-calc-input"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
              />

              <label className="estimate-calc-label">Phone</label>
              <input
                type="tel"
                className="estimate-calc-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(737) 000-0000"
              />

              <label className="estimate-calc-label">Email</label>
              <input
                type="email"
                className="estimate-calc-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <label className="estimate-calc-label">ZIP Code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                className="estimate-calc-input"
                value={contactZip}
                onChange={(e) => setContactZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="787XX"
              />

              <p className="estimate-calc-hint" style={{ marginTop: 10 }}>
                Name, ZIP, and either phone or email are required.
              </p>

              <button
                className="estimate-calc-send-btn"
                onClick={handleSendEstimate}
                disabled={!canSubmit || submitStatus === "sending"}
              >
                {submitStatus === "sending" ? "Sending..." : "Send This Estimate to Our Team"}
              </button>

              {submitStatus === "error" && (
                <p className="estimate-calc-error">{submitError}</p>
              )}
            </>
            )}
          </div>
        )}
        </div>
      </div>
      )}
    </div>  
  );
}
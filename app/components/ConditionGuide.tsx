"use client";

type ConditionExample = {
  level: string;
  label: string;
  aroundTheHome: string;
  appliancesAndFixtures: string;
  isIntensive?: boolean;
};

const CONDITION_EXAMPLES: ConditionExample[] = [
  {
    level: "light",
    label: "Light upkeep",
    aroundTheHome:
      "Floors, counters, and surfaces are free of buildup. A quick wipe-down would keep things looking this way.",
    appliancesAndFixtures:
      "Little to no residue inside the fridge or oven. Cabinet fronts are free of sticky residue.",
  },
  {
    level: "standard",
    label: "Everyday Condition",
    aroundTheHome:
      "Normal daily living — some dust, light counter clutter, minor marks near light switches or door handles.",
    appliancesAndFixtures:
      "Typical use residue — a few spills in the fridge, light grease near the stovetop, nothing that needs scrubbing.",
  },
  {
    level: "moderate",
    label: "Moderate buildup",
    aroundTheHome:
      "Visible grime on frequently-touched surfaces, some soap scum in bathrooms, dust buildup in corners or along baseboards.",
    appliancesAndFixtures:
      "Noticeable grease or residue building up inside the oven or on cabinet fronts. The fridge may have a few older spills.",
  },
  {
    level: "heavy",
    label: "Heavy buildup",
    aroundTheHome:
      "Significant grease or grime across multiple rooms — buildup that's been there a while. Window tracks or blinds may show heavy dust.",
    appliancesAndFixtures:
      "Baked-on grease inside the oven, sticky buildup in cabinets, fridge shelves that may need real scrubbing.",
  },
  {
    level: "intensive",
    label: "Intensive condition",
    aroundTheHome:
      "Strong odors, extensive buildup across most surfaces, or multiple rooms needing attention.",
    appliancesAndFixtures:
      "If this sounds like your space, select this option — a neatiful representative will reach out to arrange a personal assessment before any pricing is set. This isn't something to feel embarrassed about; it just means the job needs a closer look than a flat rate can capture fairly.",
    isIntensive: true,
  },
];

export default function ConditionGuide() {
  return (
    <details className="estimate-calc-condition-guide">
      <summary className="estimate-calc-condition-guide-trigger">
        See what each level looks like
      </summary>
      <p className="estimate-calc-hint">
        These written examples are here to help you choose the closest match — think of them as
        a guide, not a strict checklist.
      </p>
      <div className="estimate-calc-condition-guide-list">
        {CONDITION_EXAMPLES.map((ex) => (
          <div
            key={ex.level}
            className={
              ex.isIntensive
                ? "estimate-calc-condition-guide-card estimate-calc-condition-guide-card-intensive"
                : "estimate-calc-condition-guide-card"
            }
          >
            <h4 className="estimate-calc-condition-guide-title">{ex.label}</h4>
            {ex.isIntensive ? (
              <p className="estimate-calc-condition-guide-text">{ex.aroundTheHome} {ex.appliancesAndFixtures}</p>
            ) : (
              <>
                <p className="estimate-calc-condition-guide-text">
                  <strong>Around the home: </strong>
                  {ex.aroundTheHome}
                </p>
                <p className="estimate-calc-condition-guide-text">
                  <strong>Appliances &amp; fixtures: </strong>
                  {ex.appliancesAndFixtures}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
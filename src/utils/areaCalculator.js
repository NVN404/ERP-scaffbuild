// Construction Scaffolding, Shuttering Area & Cubic Metre Volume Estimator

export const SQFT_TO_SQM = 0.092903;
export const SQM_TO_SQFT = 10.7639;
export const CUFT_TO_CUM = 0.0283168;
export const CUM_TO_CUFT = 35.3147;
export const FEET_TO_METRE = 0.3048;
export const METRE_TO_FEET = 3.28084;

/**
 * Slab Shuttering & Staging Estimator
 */
export function calculateSlabShuttering({
  unit = "feet", // "feet" or "metre"
  length = 40,
  width = 25,
  slabThicknessMm = 150, // standard 150mm (6 inch)
  clearHeight = 10, // 10 ft or 3m
  propSpacingSqft = 9, // 1 prop per 9 sq ft
  plateType = "SH-PL-900600" // 900x600 (3x2 ft) approx 5.81 sq ft
}) {
  const l = Number(length) || 0;
  const w = Number(width) || 0;
  const h = Number(clearHeight) || 0;
  const thMm = Number(slabThicknessMm) || 150;

  let areaSqft = 0;
  let areaSqm = 0;
  let volumeCum = 0;
  let volumeCuft = 0;
  let heightMetres = 0;

  if (unit === "feet") {
    areaSqft = l * w;
    areaSqm = areaSqft * SQFT_TO_SQM;
    heightMetres = h * FEET_TO_METRE;
    const thicknessM = thMm / 1000;
    volumeCum = areaSqm * thicknessM;
    volumeCuft = volumeCum * CUM_TO_CUFT;
  } else {
    areaSqm = l * w;
    areaSqft = areaSqm * SQM_TO_SQFT;
    heightMetres = h;
    const thicknessM = thMm / 1000;
    volumeCum = areaSqm * thicknessM;
    volumeCuft = volumeCum * CUM_TO_CUFT;
  }

  // Plate calculation (Plate area with 5% allowance for borders & overlaps)
  // 900x600 = 0.54 sqm (5.81 sqft)
  // 1200x600 = 0.72 sqm (7.75 sqft)
  const plateSqft = plateType === "SH-PL-1200600" ? 7.75 : 5.81;
  const platesRequired = Math.ceil((areaSqft / plateSqft) * 1.05);

  // Props calculation
  const propsRequired = Math.ceil(areaSqft / Math.max(5, propSpacingSqft));

  // Acrow Spans / Joists (1 span every 3 feet beneath plates)
  const spanRows = Math.ceil(w / 3);
  const spansPerRow = Math.ceil(l / 10);
  const spansRequired = Math.ceil(spanRows * spansPerRow);

  // Stirrup Heads (U-Jacks) and Base Plates
  const uJacksRequired = propsRequired;
  const baseJacksRequired = propsRequired;

  // Horizontal Tie Pipes for prop bracing (approx 1.8m pipe per prop)
  const bracingPipes6m = Math.ceil((propsRequired * 1.8) / 6);
  const fixedCouplers = propsRequired * 2;

  return {
    dimensions: { length: l, width: w, clearHeight: h, slabThicknessMm: thMm, unit },
    area: {
      sqft: Number(areaSqft.toFixed(2)),
      sqm: Number(areaSqm.toFixed(2))
    },
    volume: {
      cum: Number(volumeCum.toFixed(3)),
      cuft: Number(volumeCuft.toFixed(2))
    },
    materials: [
      {
        itemId: plateType,
        name: plateType === "SH-PL-1200600" ? "MS Shuttering Plate 1200x600 mm (4' x 2')" : "MS Shuttering Plate 900x600 mm (3' x 2')",
        quantity: platesRequired,
        unit: "Pcs",
        ratePerDay: plateType === "SH-PL-1200600" ? 2.0 : 1.5,
        notes: "Includes 5% border/lap allowance"
      },
      {
        itemId: heightMetres > 3.2 ? "PR-3045" : "PR-2035",
        name: heightMetres > 3.2 ? "Telescopic Steel Prop 3.0m to 4.5m (High Staging)" : "Telescopic Steel Prop 2.0m to 3.5m (Heavy Duty)",
        quantity: propsRequired,
        unit: "Pcs",
        ratePerDay: heightMetres > 3.2 ? 4.5 : 3.5,
        notes: `Estimated @ 1 prop per ${propSpacingSqft} sq.ft`
      },
      {
        itemId: "SP-AC-2542",
        name: "Acrow Telescopic Span / Joist (2.5m - 4.2m)",
        quantity: spansRequired,
        unit: "Pcs",
        ratePerDay: 6.0,
        notes: "Grid spacing @ 3 ft centres"
      },
      {
        itemId: "JK-U-350",
        name: "Adjustable Stirrup Head / U-Jack 350mm (Solid)",
        quantity: uJacksRequired,
        unit: "Pcs",
        ratePerDay: 1.0,
        notes: "1 per telescopic prop"
      },
      {
        itemId: "JK-BS-350",
        name: "Adjustable Base Jack 350mm (Solid Spindle)",
        quantity: baseJacksRequired,
        unit: "Pcs",
        ratePerDay: 1.0,
        notes: "Bottom support & levelling"
      },
      {
        itemId: "PP-MS-60",
        name: "MS Scaffolding Tube 40NB (6.0m length)",
        quantity: bracingPipes6m,
        unit: "Pcs",
        ratePerDay: 4.0,
        notes: "Double cross horizontal bracing"
      },
      {
        itemId: "CP-FX-50",
        name: "Forged Right Angle Coupler (Fixed Clamp)",
        quantity: fixedCouplers,
        unit: "Pcs",
        ratePerDay: 0.4,
        notes: "Clamps for bracing pipes"
      }
    ]
  };
}

/**
 * Column Shuttering Estimator
 */
export function calculateColumnShuttering({
  unit = "feet", // "feet" or "metre"
  columnLength = 1.5, // 18 inches
  columnWidth = 1.0,  // 12 inches
  columnHeight = 10,  // 10 ft
  numberOfColumns = 8
}) {
  const l = Number(columnLength) || 1.5;
  const w = Number(columnWidth) || 1.0;
  const h = Number(columnHeight) || 10;
  const count = Number(numberOfColumns) || 1;

  let perimeter = 0;
  let singleAreaSqft = 0;
  let singleAreaSqm = 0;
  let singleVolumeCum = 0;

  if (unit === "feet") {
    perimeter = 2 * (l + w);
    singleAreaSqft = perimeter * h;
    singleAreaSqm = singleAreaSqft * SQFT_TO_SQM;
    const lMetre = l * FEET_TO_METRE;
    const wMetre = w * FEET_TO_METRE;
    const hMetre = h * FEET_TO_METRE;
    singleVolumeCum = lMetre * wMetre * hMetre;
  } else {
    perimeter = 2 * (l + w);
    singleAreaSqm = perimeter * h;
    singleAreaSqft = singleAreaSqm * SQM_TO_SQFT;
    singleVolumeCum = l * w * h;
  }

  const totalAreaSqft = singleAreaSqft * count;
  const totalAreaSqm = singleAreaSqm * count;
  const totalVolumeCum = singleVolumeCum * count;
  const totalVolumeCuft = totalVolumeCum * CUM_TO_CUFT;

  // Clamps: 1 clamp set every 1.5 ft (0.45m) of height
  const heightInFt = unit === "feet" ? h : h * METRE_TO_FEET;
  const clampsPerCol = Math.ceil(heightInFt / 1.5);
  const totalClamps = clampsPerCol * count;

  // Plates needed per column
  const platesPerCol = Math.ceil(singleAreaSqft / 5.81);
  const totalPlates = platesPerCol * count;

  return {
    dimensions: { columnLength: l, columnWidth: w, columnHeight: h, numberOfColumns: count, unit },
    area: {
      sqft: Number(totalAreaSqft.toFixed(2)),
      sqm: Number(totalAreaSqm.toFixed(2)),
      singleColSqft: Number(singleAreaSqft.toFixed(2))
    },
    volume: {
      cum: Number(totalVolumeCum.toFixed(3)),
      cuft: Number(totalVolumeCuft.toFixed(2))
    },
    materials: [
      {
        itemId: "SH-PL-900300",
        name: "MS Shuttering Plate 900x300 mm (3' x 1') for Column Box",
        quantity: totalPlates,
        unit: "Pcs",
        ratePerDay: 1.0,
        notes: `Box shuttering for ${count} column(s)`
      },
      {
        itemId: "AC-COL-CLM",
        name: "MS Column Box Clamps (Set of 4 arms)",
        quantity: totalClamps,
        unit: "Set",
        ratePerDay: 2.5,
        notes: `@ 1 set every 1.5 ft height (${clampsPerCol} sets/col)`
      },
      {
        itemId: "AC-TR-16",
        name: "Tie Rod 16mm (1.0m) with 2 Wing Nuts",
        quantity: totalClamps * 2,
        unit: "Set",
        ratePerDay: 0.6,
        notes: "Column wall through-ties"
      },
      {
        itemId: "PR-2035",
        name: "Telescopic Steel Prop 2.0m to 3.5m (Plumb Supports)",
        quantity: count * 2,
        unit: "Pcs",
        ratePerDay: 3.5,
        notes: "2 props per column for vertical plumbing alignment"
      }
    ]
  };
}

/**
 * External Cuplock / Pipe Scaffolding Staging Volume & Material Estimator
 * Calculates Elevation Area AND Staging Volume in Cubic Metres & Cubic Feet
 */
export function calculateCuplockScaffolding({
  unit = "metre", // "metre" or "feet"
  length = 30, // Facade length (e.g. 30m)
  height = 15, // Building height (e.g. 15m)
  bayDepth = 1.2, // Staging bay depth (standard 1.2m / 4 ft)
  tierLifts = 2.0 // Lift interval (standard 2m)
}) {
  const l = Number(length) || 10;
  const h = Number(height) || 10;
  const d = Number(bayDepth) || 1.2;

  let lengthM = 0;
  let heightM = 0;
  let depthM = 0;

  if (unit === "feet") {
    lengthM = l * FEET_TO_METRE;
    heightM = h * FEET_TO_METRE;
    depthM = d * FEET_TO_METRE;
  } else {
    lengthM = l;
    heightM = h;
    depthM = d;
  }

  // Area & Volume Calculations
  const elevationAreaSqm = lengthM * heightM;
  const elevationAreaSqft = elevationAreaSqm * SQM_TO_SQFT;

  // Staging Volume in Cubic Metres and Cubic Feet!
  const stagingVolumeCum = lengthM * heightM * depthM;
  const stagingVolumeCuft = stagingVolumeCum * CUM_TO_CUFT;

  // Cuplock Component Estimation
  // Bay length standard = 2.0m or 2.5m
  const bayLengthStandard = 2.0;
  const numBays = Math.ceil(lengthM / bayLengthStandard);
  const verticalLines = (numBays + 1) * 2; // Two lines: inner & outer wall row

  // Heights stacked (3m and 2m standards)
  const standards3mPerLine = Math.floor(heightM / 3);
  const remainingHeight = heightM % 3;
  const standards2mPerLine = remainingHeight > 0.5 ? 1 : 0;

  const totalStandards3m = verticalLines * standards3mPerLine;
  const totalStandards2m = verticalLines * standards2mPerLine;

  // Lifts count
  const liftsCount = Math.ceil(heightM / tierLifts);

  // Ledgers 2.0m (along facade length)
  const ledgers2m = numBays * 2 * liftsCount; // 2 rows (inner + outer)

  // Ledgers 1.2m / Transoms (depth connection between inner & outer)
  const ledgers12m = (numBays + 1) * liftsCount;

  // Base Jacks / Base Plates
  const baseJacks = verticalLines;

  // Walkway Challi (Steel Planks 2m x 0.3m) - 4 planks per 1.2m bay width on 2 working levels
  const workingLevels = Math.min(3, Math.max(1, Math.ceil(liftsCount / 2)));
  const walkwayChalli = numBays * 4 * workingLevels;

  // Diagonal Bracing Pipes & Swivel Couplers
  const bracingPipes6m = Math.ceil(numBays * liftsCount * 0.4);
  const swivelCouplers = bracingPipes6m * 4;

  return {
    dimensions: { length: l, height: h, bayDepth: d, unit },
    area: {
      elevationSqft: Number(elevationAreaSqft.toFixed(2)),
      elevationSqm: Number(elevationAreaSqm.toFixed(2))
    },
    volume: {
      stagingCum: Number(stagingVolumeCum.toFixed(2)),
      stagingCuft: Number(stagingVolumeCuft.toFixed(2))
    },
    materials: [
      {
        itemId: "CP-STD-30",
        name: "Cuplock Standard / Vertical 3.0m (6 Cups)",
        quantity: totalStandards3m,
        unit: "Pcs",
        ratePerDay: 3.0,
        notes: `${verticalLines} vertical lines stacked`
      },
      ...(totalStandards2m > 0 ? [{
        itemId: "CP-STD-20",
        name: "Cuplock Standard / Vertical 2.0m (4 Cups)",
        quantity: totalStandards2m,
        unit: "Pcs",
        ratePerDay: 2.2,
        notes: "Top-up vertical standard"
      }] : []),
      {
        itemId: "CP-LED-20",
        name: "Cuplock Ledger / Horizontal 2.0m (Bay Runner)",
        quantity: ledgers2m,
        unit: "Pcs",
        ratePerDay: 1.8,
        notes: `${liftsCount} lifts along facade`
      },
      {
        itemId: "CP-LED-12",
        name: "Cuplock Ledger / Transom 1.2m (Cross Tie)",
        quantity: ledgers12m,
        unit: "Pcs",
        ratePerDay: 1.2,
        notes: "Bay depth cross connections"
      },
      {
        itemId: "JK-BS-350",
        name: "Adjustable Base Jack 350mm (Solid Spindle)",
        quantity: baseJacks,
        unit: "Pcs",
        ratePerDay: 1.0,
        notes: "Base ground alignment"
      },
      {
        itemId: "PL-CH-20",
        name: "Steel Walkway Challi / Plank 2.0m x 300mm",
        quantity: walkwayChalli,
        unit: "Pcs",
        ratePerDay: 3.5,
        notes: `Platform for ${workingLevels} working tiers`
      },
      {
        itemId: "PP-MS-60",
        name: "MS Scaffolding Tube 40NB (6.0m) for Diagonal Bracing",
        quantity: bracingPipes6m,
        unit: "Pcs",
        ratePerDay: 4.0,
        notes: "Wind & diagonal sway stability"
      },
      {
        itemId: "CP-SW-50",
        name: "Forged Swivel Coupler (360° Clamp)",
        quantity: swivelCouplers,
        unit: "Pcs",
        ratePerDay: 0.5,
        notes: "For diagonal pipe attachments"
      }
    ]
  };
}

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- Mock Data --------------------
type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;     // gCO2e/MJ
  fuelConsumption: number;  // t
  distance: number;         // km
  totalEmissions: number;   // t
  isBaseline: boolean;
};

const TARGET_GHG = 89.3368;      // gCO2e/MJ
const ENERGY_PER_TON = 41000;     // MJ per ton fuel

const routes: Route[] = [
  { routeId: "R001", vesselType: "Container",   fuelType: "HFO", year: 2024, ghgIntensity: 91.0,  fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true },
  { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0,  fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
  { routeId: "R003", vesselType: "Tanker",      fuelType: "MGO", year: 2024, ghgIntensity: 93.5,  fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
  { routeId: "R004", vesselType: "RoRo",        fuelType: "HFO", year: 2025, ghgIntensity: 89.2,  fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
  { routeId: "R005", vesselType: "Container",   fuelType: "LNG", year: 2025, ghgIntensity: 90.5,  fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false }
];

// Bank & compliance state (in-memory) keyed by shipId+year
const cbSnapshots = new Map<string, number>();   // key `${shipId}:${year}` -> cb
const bankLedger  = new Map<string, number>();   // net banked (positive = banked, negative = applied)

// -------------------- Helpers --------------------
const key = (shipId: string, year: number) => `${shipId}:${year}`;

function percentDiff(comparison: number, baseline: number) {
  return ((comparison / baseline) - 1) * 100;
}

function energyInScopeMJ(fuelTon: number) {
  return fuelTon * ENERGY_PER_TON;
}

function computeCB(actualGhg: number, fuelTon: number) {
  // (Target − Actual) × Energy
  return (TARGET_GHG - actualGhg) * energyInScopeMJ(fuelTon);
}

// -------------------- ROUTES --------------------
app.get("/routes", (req, res) => {
  const { vesselType, fuelType, year } = req.query as any;
  let data = [...routes];
  if (vesselType) data = data.filter(r => r.vesselType === vesselType);
  if (fuelType)  data = data.filter(r => r.fuelType === fuelType);
  if (year)      data = data.filter(r => r.year === Number(year));
  res.json(data);
});

app.post("/routes/:routeId/baseline", (req, res) => {
  const { routeId } = req.params;
  routes.forEach(r => (r.isBaseline = r.routeId === routeId));
  res.json({ ok: true });
});

app.get("/routes/comparison", (_req, res) => {
  const baseline = routes.find(r => r.isBaseline);
  if (!baseline) return res.json({ baseline: null, comparisons: [] });

  const comparisons = routes
    .filter(r => r.routeId !== baseline.routeId)
    .map(r => ({
      routeId: r.routeId,
      baseline: baseline.ghgIntensity,
      comparison: r.ghgIntensity,
      percentDiff: percentDiff(r.ghgIntensity, baseline.ghgIntensity),
      compliant: r.ghgIntensity <= TARGET_GHG   // vs target
    }));

  res.json({ baseline, comparisons });
});

// -------------------- COMPLIANCE --------------------
// GET /compliance/cb?shipId=&year=&ghg=&fuel=
app.get("/compliance/cb", (req, res) => {
  const shipId = (req.query.shipId as string) ?? "S001";
  const year   = Number((req.query.year as string) ?? "2025");
  // If ghg & fuel provided, compute; else use baseline route as demo
  const ghg    = req.query.ghg ? Number(req.query.ghg) : (routes.find(r => r.isBaseline)?.ghgIntensity ?? 90);
  const fuel   = req.query.fuel ? Number(req.query.fuel) : (routes.find(r => r.isBaseline)?.fuelConsumption ?? 5000);

  const cb = computeCB(ghg, fuel);
  cbSnapshots.set(key(shipId, year), cb);

  res.json({ shipId, year, cb });
});

// GET /compliance/adjusted-cb?shipId=&year=
app.get("/compliance/adjusted-cb", (req, res) => {
  const shipId = (req.query.shipId as string) ?? "S001";
  const year   = Number((req.query.year as string) ?? "2025");
  const base  = cbSnapshots.get(key(shipId, year)) ?? 0;
  const bank  = bankLedger.get(key(shipId, year)) ?? 0;
  res.json([{ shipId, year, adjustedCB: base + bank }]);
});

// -------------------- BANKING (Article 20 – simplified) --------------------
/**
 * POST /banking/bank
 * body: { shipId, year, amount }
 * Banks positive CB into ledger
 */
app.post("/banking/bank", (req, res) => {
  const { shipId = "S001", year = 2025, amount = 0 } = req.body ?? {};
  if (amount <= 0) return res.status(400).json({ error: "Nothing to bank" });
  const k = key(shipId, Number(year));
  const current = bankLedger.get(k) ?? 0;
  bankLedger.set(k, current + amount);
  const cb_before = current;
  const cb_after  = current + amount;
  res.json({ cb_before, applied: 0, cb_after });
});

/**
 * POST /banking/apply
 * body: { shipId, year, amount }
 * Applies banked surplus to reduce deficit (amount must be ≤ available bank)
 */
app.post("/banking/apply", (req, res) => {
  const { shipId = "S001", year = 2025, amount = 0 } = req.body ?? {};
  const k = key(shipId, Number(year));
  const current = bankLedger.get(k) ?? 0;
  if (amount > current) return res.status(400).json({ error: "Insufficient banked surplus" });
  bankLedger.set(k, current - amount);
  res.json({ cb_before: current, applied: amount, cb_after: current - amount });
});
// -------------------- POOLING (Article 21 – simplified greedy) --------------------
/**
 * POST /pools
 * body: { year: number, members: [{ shipId: string; before: number }] }
 * Rules:
 *  - Sum(after) ≥ 0
 *  - Deficit ship cannot exit worse
 *  - Surplus ship cannot exit negative
 */
app.post("/pools", (req, res) => {
  type MemberIn = { shipId: string; before: number };
  type MemberOut = { shipId: string; before: number; after: number };

  const year: number = Number((req.body?.year ?? 2025) as number);
  const membersIn: MemberIn[] = Array.isArray(req.body?.members) ? req.body.members : [];

  // Defensive copy + basic validation
  const cleanMembers: MemberIn[] = membersIn
    .filter(m => m && typeof m.shipId === "string" && Number.isFinite(m.before))
    .map(m => ({ shipId: m.shipId, before: Number(m.before) }));

  // Early return if empty input
  if (cleanMembers.length === 0) {
    return res.json({ year, members: [] as MemberOut[], poolSum: 0, ok: true });
  }

  // Split into surplus / deficits
  const surplus: MemberIn[]  = cleanMembers.filter(m => m.before > 0).sort((a, b) => b.before - a.before);
  const deficits: MemberIn[] = cleanMembers.filter(m => m.before < 0).sort((a, b) => a.before - b.before);

  // Track mutable state (after values), seed with 'before'
  const state: Record<string, number> = {};
  for (const m of cleanMembers) state[m.shipId] = m.before;

  // Greedy transfer from surplus to deficits
  for (const s of surplus) {
    let available: number = state[s.shipId] ?? 0; // ensure number
    if (available <= 0) continue;

    for (const d of deficits) {
      if (available <= 0) break;

      const currentDef: number = state[d.shipId] ?? 0;
      const need: number = currentDef < 0 ? -currentDef : 0; // how much to bring deficit to 0
      if (need <= 0) continue;

      const give: number = Math.min(available, need);
      state[s.shipId] = (state[s.shipId] ?? 0) - give;
      state[d.shipId] = (state[d.shipId] ?? 0) + give;

      available = state[s.shipId] ?? 0; // keep local in sync (now definitely a number)
    }
  }

  // Build output with non-undefined 'after'
  const membersOut: MemberOut[] = cleanMembers.map(m => ({
    shipId: m.shipId,
    before: m.before,
    after: state[m.shipId] ?? m.before, // fallback guarantees a number
  }));

  // Validate rules
  const poolSum: number = membersOut.reduce((sum, m) => sum + m.after, 0);

  if (poolSum < 0) {
    return res.status(400).json({ error: "Pool sum must be ≥ 0" });
  }
  for (const m of membersOut) {
    // Deficit member cannot exit worse: after ≥ before when before < 0
    if (m.before < 0 && m.after < m.before) {
      return res.status(400).json({ error: `Deficit ${m.shipId} cannot exit worse` });
    }
    // Surplus member cannot exit negative: after ≥ 0 when before > 0
    if (m.before > 0 && m.after < 0) {
      return res.status(400).json({ error: `Surplus ${m.shipId} cannot exit negative` });
    }
  }

  return res.json({ year, members: membersOut, poolSum, ok: true });
});


// -------------------- Start --------------------
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`✅ Mock API on http://localhost:${port}`));

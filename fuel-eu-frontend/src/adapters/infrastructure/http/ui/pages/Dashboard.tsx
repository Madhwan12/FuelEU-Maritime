import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { routesApi } from "../../routesApi";                
import { bankingApi } from "../../bankingApi";           
import { poolingApi } from "../../poolingApi";           

import { Tabs } from "../components/Tabs";
import { DataTable } from "../components/DataTable";
import { Select } from "../components/Select";
import { ErrorBanner } from "../components/ErrorBanner";

import { CompareChart } from "../components/CompareChart";

import { percentDiff } from "../../../../../shared/utils/percentDiff";
import { TARGET_GHG } from "../../../../../shared/config";
import type { ComparisonRow } from "../../../../../core/domain/types";

export default function Dashboard() {
  const qc = useQueryClient();

  // ===== ROUTES TAB =====
  const [vesselType, setVesselType] = useState<string | undefined>();
  const [fuelType, setFuelType] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const routesQ = useQuery({
    queryKey: ["routes", vesselType ?? "", fuelType ?? "", year ?? ""],
    queryFn: () => routesApi.fetchRoutes({ vesselType, fuelType, year }),
    retry: false,
  });

  const setBaselineM = useMutation({
    mutationFn: (routeId: string) => routesApi.setBaseline(routeId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["routes"] });
      await qc.invalidateQueries({ queryKey: ["comparison"] });
    },
  });

  // ===== COMPARE TAB =====
  const comparisonQ = useQuery({
    queryKey: ["comparison"],
    queryFn: () => routesApi.fetchComparison(), // returns { baseline, comparisons }
  });

  
   const [bankYear, setBankYear] = useState<number>(new Date().getFullYear());
   const [bankAmount, setBankAmount] = useState<number>(0);
  const [applyAmount, setApplyAmount] = useState<number>(0);

const cbQ = useQuery({
  queryKey: ["cb", bankYear],
  queryFn: () => bankingApi.getCB(bankYear), // GET /compliance/cb?year=
});

const bankM = useMutation({
  mutationFn: () => bankingApi.bank(Math.max(bankAmount, 0), bankYear),
  onSuccess: () => cbQ.refetch(),
});

const applyM = useMutation({
  mutationFn: () => bankingApi.apply(Math.max(applyAmount, 0), bankYear),
  onSuccess: () => cbQ.refetch(),
});

// // ===== POOLING STATE/QUERIES =====
const [poolYear, setPoolYear] = useState<number>(new Date().getFullYear());

const adjQ = useQuery({
  queryKey: ["adjustedCB", poolYear],
  queryFn: () => poolingApi.adjusted(poolYear), // GET /compliance/adjusted-cb?year=
});

// Build safe members list (no negative sum)
function buildSafeMembers() {
  const base = (adjQ.data ?? []).map(
    (m: { shipId: string; year: number; adjustedCB: number }) => ({
      shipId: m.shipId,
      before: m.adjustedCB,
    })
  );

  const sum = base.reduce((s, m) => s + m.before, 0);
  if (sum >= 0) return base;

  // Add a small buffer surplus so the pool is valid
  const buffer = { shipId: "POOLBUF", before: -sum + 1 }; // +1 to be safely >= 0
  return [...base, buffer];
}

const poolM = useMutation({
  mutationFn: () => poolingApi.create(poolYear, buildSafeMembers()),
});

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fuel EU Compliance Dashboard</h1>

      <Tabs
        tabs={[
          {
            id: "routes",
            label: "Routes",
            content: (
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <Select value={vesselType ?? ""} onChange={(e) => setVesselType(e.target.value || undefined)}>
                    <option value="">All Vessels</option>
                    <option>Container</option>
                    <option>BulkCarrier</option>
                    <option>Tanker</option>
                    <option>RoRo</option>
                  </Select>

                  <Select value={fuelType ?? ""} onChange={(e) => setFuelType(e.target.value || undefined)}>
                    <option value="">All Fuels</option>
                    <option>HFO</option>
                    <option>LNG</option>
                    <option>MGO</option>
                  </Select>

                  <Select value={year ?? ""} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}>
                    <option value="">All Years</option>
                    <option>2024</option>
                    <option>2025</option>
                  </Select>
                </div>

                {routesQ.error && <ErrorBanner message={(routesQ.error as Error).message} />}

                <DataTable
                  rows={routesQ.data ?? []}
                  cols={[
                    { key: "routeId", header: "Route" },
                    { key: "vesselType", header: "Vessel" },
                    { key: "fuelType", header: "Fuel" },
                    { key: "year", header: "Year" },
                    { key: "ghgIntensity", header: "gCO₂e/MJ" },
                    { key: "distance", header: "Distance (km)" },
                    { key: "totalEmissions", header: "Emissions (t)" },
                    {
                      key: "isBaseLine", header: "Baseline",
                      render: (r) => (r.isBaseLine ? "✅" : "—"),
                    },
                    {
                      key: "baselineAction",// unique key (fixed)
                      header: "",
                      render: (r) => (
                        <button
                          onClick={() => setBaselineM.mutate(r.routeId)}
                          className="border px-2 py-1 rounded hover:bg-gray-100"
                        >
                          Set Baseline
                        </button>
                      ),
                    },
                  ]}
                />
              </div>
            ),
          },

          {
            id: "compare",
            label: "Compare",
            content: (
              <div className="space-y-4">
                {comparisonQ.error && <ErrorBanner message={(comparisonQ.error as Error).message} />}

                <DataTable
                  rows={(comparisonQ.data?.comparisons ?? []).map((r: ComparisonRow) => ({
                    routeId: r.routeId,
                    baseline: r.baseline,
                    comparison: r.comparison,
                    percent: percentDiff(r.comparison, r.baseline).toFixed(2) + "%",
                    compliant: r.comparison <= TARGET_GHG ? "✅" : "❌",
                  }))}
                  cols={[
                    { key: "routeId", header: "Route" },
                    { key: "baseline", header: "Baseline" },
                    { key: "comparison", header: "Comparison" },
                    { key: "percent", header: "% Change" },
                    { key: "compliant", header: "Compliant" },
                  ]}
                />

                <CompareChart
                  data={(comparisonQ.data?.comparisons ?? []).map((d: ComparisonRow) => ({
                 routeId: d.routeId,
                 baseline: d.baseline,
                 comparison: d.comparison,
                 }))}
/>
              </div>
            ),
          },
           {
  id: "banking",
  label: "Banking",
  content: (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Year</label>
        <Select
          value={String(bankYear)}
          onChange={(e) => setBankYear(Number(e.target.value))}
        >
          <option>2024</option>
          <option>2025</option>
        </Select>

        <div className="ml-6 text-sm">
          Current CB:&nbsp;
          <span className={(cbQ.data?.cb ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>
            {cbQ.isLoading ? "…" : cbQ.data?.cb?.toLocaleString() ?? "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm w-24">Bank amount</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-40"
            value={bankAmount}
            onChange={(e) => setBankAmount(Number(e.target.value))}
            placeholder="e.g. 10000"
          />
          <button
            className="border px-3 py-1 rounded hover:bg-gray-100"
            onClick={() => bankM.mutate()}
            disabled={(cbQ.data?.cb ?? 0) <= 0 || bankM.isPending}
          >
            {bankM.isPending ? "Banking…" : "Bank Surplus"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm w-24">Apply amount</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-40"
            value={applyAmount}
            onChange={(e) => setApplyAmount(Number(e.target.value))}
            placeholder="e.g. 5000"
          />
          <button
            className="border px-3 py-1 rounded hover:bg-gray-100"
            onClick={() => applyM.mutate()}
            disabled={(cbQ.data?.cb ?? 0) <= 0 || applyM.isPending}
          >
            {applyM.isPending ? "Applying…" : "Apply Banked"}
          </button>
        </div>
      </div>

      {(bankM.error || applyM.error) && (
        <ErrorBanner message={((bankM.error || applyM.error) as Error)?.message} />
      )}
    </div>
  ),
},
{
  id: "pooling",
  label: "Pooling",
  content: (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Year</label>
        <Select
          value={String(poolYear)}
          onChange={(e) => setPoolYear(Number(e.target.value))}
        >
          <option>2024</option>
          <option>2025</option>
        </Select>
      </div>

      {adjQ.error && <ErrorBanner message={(adjQ.error as Error).message} />}

      <DataTable
        rows={(adjQ.data ?? []).map((m) => ({
          shipId: m.shipId,
          before: m.adjustedCB,  // we treat adjustedCB as "before" for pooling input
        }))}
        cols={[
          { key: "shipId", header: "Ship" },
          { key: "before", header: "Before (CB)" },
        ]}
      />

      <button
        className="border px-3 py-1 rounded hover:bg-gray-100"
        onClick={() => poolM.mutate()}
        disabled={poolM.isPending || (adjQ.data ?? []).length === 0}
      >
        {poolM.isPending ? "Creating Pool…" : "Create Pool"}
      </button>

      {poolM.error && <ErrorBanner message={(poolM.error as Error).message} />}

      {poolM.data && (
        <div className="space-y-2">
          <div className="text-sm">
            Pool Sum:&nbsp;
            <span className={poolM.data.poolSum >= 0 ? "text-green-600" : "text-red-600"}>
              {poolM.data.poolSum}
            </span>
          </div>

          <DataTable
            rows={poolM.data.members}
            cols={[
              { key: "shipId", header: "Ship" },
              { key: "before", header: "Before" },
              { key: "after", header: "After" },
            ]}
          />
        </div>
      )}
    </div>
  ),
}

        ]}
      />
    </div>
  );
}

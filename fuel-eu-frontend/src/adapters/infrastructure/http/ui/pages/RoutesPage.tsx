import { useEffect, useState } from "react";
import { routesApi } from "../../routesApi";

export default function RoutesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    routesApi
      .fetchRoutes({})
      .then(setRows)
      .catch((e) => setError(e?.message ?? "Failed to fetch routes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading routes…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Routes</h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-2 py-1 text-left">Route</th>
            <th className="border px-2 py-1 text-left">Vessel</th>
            <th className="border px-2 py-1 text-left">Fuel</th>
            <th className="border px-2 py-1 text-left">Year</th>
            <th className="border px-2 py-1 text-left">gCO₂e/MJ</th>
            <th className="border px-2 py-1 text-left">Baseline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.routeId}>
              <td className="border px-2 py-1">{r.routeId}</td>
              <td className="border px-2 py-1">{r.vesselType}</td>
              <td className="border px-2 py-1">{r.fuelType}</td>
              <td className="border px-2 py-1">{r.year}</td>
              <td className="border px-2 py-1">{r.ghgIntensity}</td>
              <td className="border px-2 py-1">{r.isBaseline ? "✅" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

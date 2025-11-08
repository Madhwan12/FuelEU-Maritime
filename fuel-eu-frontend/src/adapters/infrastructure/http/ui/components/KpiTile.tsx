export function KpiTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded p-3 text-center">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

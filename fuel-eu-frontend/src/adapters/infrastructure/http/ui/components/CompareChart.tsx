import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function CompareChart({
  data,
}: {
  data: { routeId: string; baseline: number; comparison: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="routeId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="baseline" fill="#8884d8" />
          <Bar dataKey="comparison" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import { type ReactNode } from "react";

type Column<T> = { key: keyof T | string; header: string; render?: (row: T) => ReactNode };

export function DataTable<T extends Record<string, any>>({
  rows,
  cols,
}: {
  rows: T[];
  cols: Column<T>[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {cols.map((c) => (
              <th key={String(c.key)} className="px-3 py-2 text-left border-b">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {cols.map((c) => (
                <td key={String(c.key)} className="px-3 py-2 border-b">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

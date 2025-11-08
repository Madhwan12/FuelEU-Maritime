import { type ReactNode, useState } from "react";

type Tab = { id: string; label: string; content: ReactNode };

export function Tabs({ tabs, initial = "routes" }: { tabs: Tab[]; initial?: string }) {
  const [active, setActive] = useState(initial);

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm ${
              active === tab.id
                ? "border-b-2 border-black font-medium"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}

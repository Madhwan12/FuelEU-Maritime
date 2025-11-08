import type { ComponentProps } from "react";

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`border rounded px-2 py-1 bg-white ${props.className ?? ""}`}
    />
  );
}

import type { RoutesPort } from "../../../ports/outbound";

export function makeFetchComparison(routes: RoutesPort) {
  return () => routes.fetchComparison();
}

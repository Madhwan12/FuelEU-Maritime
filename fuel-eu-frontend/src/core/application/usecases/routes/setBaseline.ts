import type { RoutesPort } from "../../../ports/outbound";

export function makeSetBaseline(routes: RoutesPort) {
  return (routeId: string) => routes.setBaseline(routeId);
}

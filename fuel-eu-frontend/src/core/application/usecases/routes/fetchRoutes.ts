import type { RoutesPort } from "../../../ports/outbound";
import type { RouteRow } from "../../../domain/types";

export function makeFetchRoutes(routes: RoutesPort) {
  return (filters?: Partial<Pick<RouteRow, "vesselType" | "fuelType" | "year">>) =>
    routes.fetchRoutes(filters);
}

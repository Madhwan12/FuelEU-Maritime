import type { RoutesPort } from "../../../core/ports/outbound";
import type { RouteRow } from "../../../core/domain/types";
import type { ComparisonResponse } from "../../../core/domain/types";
import { api } from "../apiClient";

export const routesApi: RoutesPort = {
  fetchRoutes(filters) {
    const q = new URLSearchParams();
    if (filters?.vesselType) q.set("vesselType", filters.vesselType);
    if (filters?.fuelType) q.set("fuelType", filters.fuelType);
    if (typeof filters?.year === "number") q.set("year", String(filters.year));

    return api.get<RouteRow[]>(`/routes${q.toString() ? `?${q.toString()}` : ""}`);
  },

  setBaseline(routeId) {
    return api.post<void>(`/routes/${routeId}/baseline`);
  },
   fetchComparison() {
    return api.get<ComparisonResponse>(`/routes/comparison`);
  },
};



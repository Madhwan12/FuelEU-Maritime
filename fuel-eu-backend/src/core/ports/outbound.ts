import type { Route } from "../domain/route";

export interface RoutesRepo {
  list(filters: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getBaseline(): Promise<Route | null>;
  listComparison(): Promise<Route[]>;
}

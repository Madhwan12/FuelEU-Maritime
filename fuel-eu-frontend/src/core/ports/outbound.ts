import type {
  RouteRow,
  ComparisonResponse,
  CbResponse,
  BankingKpis,
  AdjustedCb,
  PoolMember,
} from "../domain/types";


export interface RoutesPort {
  fetchRoutes(params?: Partial<Pick<RouteRow, "vesselType" | "fuelType" | "year">>): Promise<RouteRow[]>;
  setBaseline(routeId: string): Promise<void>;
  fetchComparison(): Promise<ComparisonResponse>;
}

export interface BankingPort {
  getCb(year: number): Promise<CbResponse>;
  bank(): Promise<BankingKpis>;
  apply(): Promise<BankingKpis>;
}

export interface PoolingPort {
  getAdjustedCb(year: number): Promise<AdjustedCb[]>;
  createPool(members: PoolMember[]): Promise<PoolMember[]>;
}

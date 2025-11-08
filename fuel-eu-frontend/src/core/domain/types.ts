export type RouteRow = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; 
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseLine: boolean;
};

export type ComparisonRow = {
  routeId: string;
  baseline: number;
  comparison: number;
};
export type ComparisonResponse = {
  baseline: RouteRow | null;
  comparisons: ComparisonRow[];
};

export type CbResponse = { year: number; cb: number };

export type BankingKpis = { cb_before: number; applied: number; cb_after: number };

export type AdjustedCb = {
  shipId: string;
  adjustedCB: number;
};

export type PoolMember = {
  shipId: string;
  before: number;
  after: number;
};

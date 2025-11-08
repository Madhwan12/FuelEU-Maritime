
export interface ComplianceRepo {
  computeAndStoreCb(shipId: string, year: number): Promise<any>;
  getAdjustedCb(shipId: string, year: number): Promise<any>;
}
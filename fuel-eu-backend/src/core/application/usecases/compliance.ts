import type { ComplianceRepo } from "../../../adapters/outbound/compliance-repo";

export function makeComputeAndStoreCb(repo: ComplianceRepo) {
  return async (shipId: string, year: number) => repo.computeAndStoreCb(shipId, year);
}

export function makeGetAdjustedCb(repo: ComplianceRepo) {
  return async (shipId: string, year: number) => repo.getAdjustedCb(shipId, year);
}

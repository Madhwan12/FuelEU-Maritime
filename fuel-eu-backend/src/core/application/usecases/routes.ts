import type { RoutesRepo } from "../../ports/outbound";

export function makeListRoutes(repo: RoutesRepo) {
  return (filters: { vesselType?: string; fuelType?: string; year?: number }) =>
    repo.list(filters);
}

export function makeSetBaseline(repo: RoutesRepo) {
  return (routeId: string) => repo.setBaseline(routeId);
}

export function makeComparison(repo: RoutesRepo) {
  return async () => {
    const routes = await repo.listComparison();
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) return { baseline: null, comparisons: [] };

    const comparisons = routes
      .filter(r => !r.isBaseline)
      .map(r => ({
        routeId: r.routeId,
        baseline: baseline.ghgIntensity,
        comparison: r.ghgIntensity,
        percentDiff: ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100,
        compliant: r.ghgIntensity <= baseline.ghgIntensity
      }));

    return { baseline, comparisons };
  };
}

import { PrismaClient } from "@prisma/client";
import type { RoutesRepo } from "../../../core/ports/outbound";
import type { Route } from "../../../core/domain/route";

function toDomain(r: any): Route {
  return {
    routeId: r.route_id,
    vesselType: r.vessel_type,
    fuelType: r.fuel_type,
    year: r.year,
    ghgIntensity: r.ghg_intensity,
    fuelConsumption: r.fuel_consumption,
    distance: r.distance,
    totalEmissions: r.total_emissions,
    isBaseline: r.is_baseline
  };
}

export class RoutesRepoPrisma implements RoutesRepo {
  constructor(private prisma: PrismaClient) {}

  async list(filters: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    const result = await this.prisma.routes.findMany({
      where: {
        ...(filters.vesselType && { vessel_type: filters.vesselType }),
        ...(filters.fuelType && { fuel_type: filters.fuelType }),
        ...(filters.year && { year: filters.year }),
      },
      orderBy: { id: "asc" }
    });
    return result.map(toDomain);
  }

  async setBaseline(routeId: string) {
    await this.prisma.routes.updateMany({ data: { is_baseline: false }});
    await this.prisma.routes.update({
      where: { route_id: routeId },
      data: { is_baseline: true }
    });
  }

  async getBaseline(): Promise<Route | null> {
    const r = await this.prisma.routes.findFirst({ where: { is_baseline: true }});
    return r ? toDomain(r) : null;
  }

  async listComparison(): Promise<Route[]> {
    const result = await this.prisma.routes.findMany({ orderBy: { id: "asc" }});
    return result.map(toDomain);
  }
}

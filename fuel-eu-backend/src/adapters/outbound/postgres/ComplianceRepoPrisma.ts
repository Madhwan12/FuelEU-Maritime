import { PrismaClient } from "@prisma/client";

export class ComplianceRepoPrisma {
  constructor(private prisma: PrismaClient) {}

  async computeAndStoreCb(shipId: string, year: number) {
    return this.prisma.ship_compliance.findMany({
      where: { ship_id: shipId, year },
    });
  }

  async getAdjustedCb(shipId: string, year: number) {
    return this.prisma.ship_compliance.findMany({
      where: { ship_id: shipId, year },
    });
  }
}

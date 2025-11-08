import { PrismaClient } from "@prisma/client";

export class BankingRepoPrisma {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  bank(shipId: string, year: number, amount: number) {
    return this.prisma.bank_entries.create({
      data: { ship_id: shipId, year, amount_gco2eq: amount }
    });
  }

  getBanked(shipId: string, year: number) {
    return this.prisma.bank_entries.findMany({
      where: { ship_id: shipId, year },
      orderBy: { id: "asc" }
    });
  }
}

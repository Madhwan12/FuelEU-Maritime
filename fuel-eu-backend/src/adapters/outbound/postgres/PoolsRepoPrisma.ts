import { PrismaClient } from "@prisma/client";

export class PoolsRepoPrisma {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createPool(year: number) {
    return this.prisma.pools.create({
      data: { year },
    });
  }

  addPoolMember(poolId: number, shipId: string, before: number, after: number) {
    return this.prisma.pool_members.create({
      data: { pool_id: poolId, ship_id: shipId, cb_before: before, cb_after: after }
    });
  }
}

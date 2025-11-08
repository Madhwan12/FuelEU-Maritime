import type { PoolingPort } from "../../../ports/outbound";
import type { PoolMember } from "../../../domain/types";

export function makeCreatePool(pooling: PoolingPort) {
  return (members: PoolMember[]) => pooling.createPool(members);
}

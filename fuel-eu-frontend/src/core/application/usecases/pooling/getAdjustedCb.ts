import type { PoolingPort } from "../../../ports/outbound";
export function makeGetAdjustedCb(pooling: PoolingPort) {
  return (year: number) => pooling.getAdjustedCb(year);
}

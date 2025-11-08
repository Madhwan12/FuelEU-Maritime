import type { BankingPort } from "../../../ports/outbound";
export function makeGetCb(banking: BankingPort) {
  return (year: number) => banking.getCb(year);
}

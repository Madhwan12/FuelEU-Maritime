import type { BankingPort } from "../../../ports/outbound";
export function makeApplyBanked(banking: BankingPort) {
  return () => banking.apply();
}

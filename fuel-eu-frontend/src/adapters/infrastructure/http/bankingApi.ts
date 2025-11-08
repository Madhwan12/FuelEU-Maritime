import { api } from "../apiClient";

export const bankingApi = {
  // Canonical name
  getCB(year: number, shipId = "S001") {
    return api.get<{ shipId: string; year: number; cb: number }>(
      `/compliance/cb?year=${year}&shipId=${shipId}`
    );
  },

  // Alias so Dashboard can call getCb or getCB
  getCb(year: number, shipId = "S001") {
    return api.get<{ shipId: string; year: number; cb: number }>(
      `/compliance/cb?year=${year}&shipId=${shipId}`
    );
  },

  bank(amount: number, year: number, shipId = "S001") {
    return api.post<{ cb_before: number; applied: number; cb_after: number }>(
      `/banking/bank`,
      { shipId, year, amount }
    );
  },

  apply(amount: number, year: number, shipId = "S001") {
    return api.post<{ cb_before: number; applied: number; cb_after: number }>(
      `/banking/apply`,
      { shipId, year, amount }
    );
  },
};



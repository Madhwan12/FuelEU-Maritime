import { api } from "../apiClient";

export const poolingApi = {
  // GET list of adjusted CBs (used to prefill pooling members)
  adjusted(year: number, shipId = "S001") {
    return api.get<{ shipId: string; year: number; adjustedCB: number }[]>(
      `/compliance/adjusted-cb?year=${year}&shipId=${shipId}`
    );
  },

  // Create pool with members [{ shipId, before }]
  create(
    year: number,
    members: { shipId: string; before: number }[]
  ) {
    return api.post<{
      year: number;
      members: { shipId: string; before: number; after: number }[];
      poolSum: number;
      ok: boolean;
    }>(`/pools`, { year, members });
  },
};



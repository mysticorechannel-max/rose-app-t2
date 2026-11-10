"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfileAction } from "../../actions/account.action";

export const PROFILE_QUERY_KEY = ["account", "profile"] as const;

export function useGetProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const result = await getProfileAction();
      if (!result.ok) throw new Error(result.message);
      return result.user;
    },
  });
}
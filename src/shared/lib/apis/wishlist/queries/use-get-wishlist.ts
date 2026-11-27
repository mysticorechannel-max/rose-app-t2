
"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getWishlist } from "../wishlist.api";
import { wishlistKeys } from "../wishlist.keys";

export function useGetWishlist() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: () => getWishlist(session!.accessToken!),
    enabled: status === "authenticated" && !!session?.accessToken,
    select: (response) => response.payload.wishlistItems,
  });
}

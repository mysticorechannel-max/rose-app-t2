"use server";

import { authorizedFetch } from "@/app/[locale]/account/lib/server/authorized-fetch";
import type { ActionResult } from "@/app/[locale]/account/lib/types/account";
import type { AddReviewBody } from "../types/review";

const REVIEWS_PATH = "/api/reviews";

export async function addReviewAction(body: AddReviewBody): Promise<ActionResult> {
  const result = await authorizedFetch<undefined>(REVIEWS_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return result.ok ? { ok: true } : result;
}

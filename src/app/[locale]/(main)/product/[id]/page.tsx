import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
  ApiRequestError,
  fetchProductById,
  fetchRelatedProducts,
} from "@/shared/lib/utils/api";
import type { Product } from "@/types/product";

import ProductDetailsView from "./_components/product-details-view";

export default async function ProductDetailsRoute({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  let product;

  try {
    product = await fetchProductById(id);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();

    throw error;
  }

  let relatedProducts: Product[] = [];

  try {
    relatedProducts = await fetchRelatedProducts({
      productId: product.id,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
    });
  } catch (error) {
    console.error("Failed to fetch related products", error);
  }

  const t = await getTranslations("home.relatedProducts");

  return (
    <ProductDetailsView
      product={product}
      relatedProducts={relatedProducts}
      relatedProductsTitle={t("title")}
    />
  );
}

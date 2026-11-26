import { Suspense } from "react";

import { ProductReviews } from "@/app/[locale]/reviews/components/product-reviews";
import { ReviewsSkeleton } from "@/app/[locale]/reviews/components/reviews-skeleton";
import { SectionHeading } from "@/shared/components/section-heading";
import { ProductCarousel } from "@/shared/components/home/product-carousel";
import type { Product, ProductDetails } from "@/types/product";

import ProductImageGallery from "./product-image-gallery";
import ProductInformation from "./product-information";

interface ProductDetailsViewProps {
  product: Product | ProductDetails;
  relatedProducts: Product[];
  relatedProductsTitle: string;
}

export default function ProductDetailsView({
  product,
  relatedProducts,
  relatedProductsTitle,
}: ProductDetailsViewProps) {
  return (
    <div className="container mx-auto px-8 py-12">
      <div className="grid grid-cols-2 items-stretch gap-12">
        <ProductImageGallery product={product} />
        <ProductInformation product={product} />
      </div>

      <div className="mt-16">
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews
            productId={product.id}
            rating={product.rating}
            ratings={product.ratings}
          />
        </Suspense>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <SectionHeading title={relatedProductsTitle} />
          <div className="mt-8">
            <ProductCarousel products={relatedProducts} linkToProductDetails />
          </div>
        </section>
      )}
    </div>
  );
}

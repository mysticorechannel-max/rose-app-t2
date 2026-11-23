import { ProductCard } from "@/shared/components/home/product-card";
import { PRODUCTS_GRID_CLASS } from "@/shared/lib/constants/products.constant";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import type { Product } from "@/types/product";

interface ProductsGridProps {
  products: Product[];
  className?: string;
}

// Figma Products frame: card 302×364, cover radius 12px
export function ProductsGrid({ products, className }: ProductsGridProps) {
  return (
    <ul className={cn(PRODUCTS_GRID_CLASS, className)}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            isNew={product.isNew}
            coverClassName="rounded-lg"
            className="h-91"
          />
        </li>
      ))}
    </ul>
  );
}

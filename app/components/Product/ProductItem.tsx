// app/components/Product/ProductItem.tsx
//this component is used in multiple places across the app, so we can use it as a single source of truth for how we render products across the app. It uses the ProductCard component under the hood, but can be extended in the future to include additional functionality (e.g. wishlist button, quick add to cart, etc.) without having to update multiple components across the app.

import { ProductCard } from './ProductCard';
import type {
  CollectionItemFragment,
  ProductItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <ProductCard product={product} loading={loading} showWishlist={true} />
  );
}

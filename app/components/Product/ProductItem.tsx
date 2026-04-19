import {ProductCard} from './ProductCard';
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

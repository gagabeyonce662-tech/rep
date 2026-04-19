import {ProductCard} from './ProductCard';

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

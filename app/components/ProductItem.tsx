import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

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
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="group flex flex-col gap-3"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="aspect-[4/5] overflow-hidden bg-brand-gray relative">
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-[10px] font-anton uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          View Detail
        </div>
        {!product.availableForSale && (
          <div className="absolute top-2 left-2 bg-brand-black text-white px-2 py-1 text-[10px] font-anton uppercase tracking-widest z-10">
            Sold Out
          </div>
        )}
      </div>
      <div className={`flex flex-col gap-1 ${!product.availableForSale ? 'opacity-40' : ''}`}>
        <h4 className="font-anton text-lg uppercase tracking-tight leading-none truncate">
          {product.title}
        </h4>
        <div className="font-assistant font-bold text-sm text-brand-black/60">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}

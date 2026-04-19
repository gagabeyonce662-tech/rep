import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {captureEvent} from '~/lib/posthog.client';
import {useWishlist} from '~/lib/useWishlist';

interface ProductCardProps {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  showWishlist?: boolean;
}

export function ProductCard({
  product,
  loading,
  showWishlist = true,
}: ProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image =
    product.featuredImage || product.selectedOrFirstAvailableVariant?.image;
  const {isInWishlist, toggleWishlist} = useWishlist();
  const isWished = isInWishlist(product.id);

  // Handle different product data structures (search vs regular products)
  const priceData =
    product.priceRange?.minVariantPrice ||
    product.selectedOrFirstAvailableVariant?.price;

  return (
    <Link
      className="group flex flex-col gap-3"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      onClick={() =>
        captureEvent('product_clicked', {
          product_id: product.id,
          product_title: product.title,
          product_handle: product.handle,
          price: priceData?.amount,
          currency: priceData?.currencyCode,
          available: product.availableForSale,
        })
      }
    >
      <div className="aspect-[4/5] overflow-hidden bg-brand-gray relative">
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-out"
          />
        )}
        {!product.availableForSale && (
          <div className="absolute top-3 left-3 font-serif italic text-xs text-brand-black bg-brand-bg/90 px-2.5 py-1 z-10">
            Sold out
          </div>
        )}
        {showWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : 'fill-transparent text-brand-black'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={`flex flex-col gap-1 pt-1 ${!product.availableForSale ? 'opacity-50' : ''}`}
      >
        <h4 className="font-serif text-lg font-light leading-snug tracking-[-0.01em] truncate text-brand-black">
          {product.title}
        </h4>
        <div className="font-assistant text-sm text-brand-muted">
          {priceData && <Money data={priceData} />}
        </div>
      </div>
    </Link>
  );
}

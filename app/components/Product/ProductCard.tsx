// app/components/Product/ProductCard.tsx
// this component is used as the base for how we render products across the app. It handles rendering the product image, title, price, and wishlist button. It also handles the hover state for showing multiple images. This allows us to have a consistent product card across the app, and we can extend it in the future to include additional functionality without having to update multiple components.

import { useState } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { captureEvent } from '~/lib/posthog.client';
import { useWishlist } from '~/lib/useWishlist';

type SearchProductWithVariant = {
  selectedOrFirstAvailableVariant?: {
    image?: {
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    };
    price?: {
      amount: string;
      currencyCode: string;
    };
  };
};

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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const variantUrl = useVariantUrl(product.handle);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  const variant = (product as SearchProductWithVariant)
    .selectedOrFirstAvailableVariant;

  const images = [product.featuredImage, variant?.image].filter(
    (image): image is NonNullable<typeof image> => Boolean(image),
  );

  const currentImage =
    images[activeImageIndex] ?? product.featuredImage ?? variant?.image;
  const hasMultipleImages = images.length > 1;

  // Handle different product data structures (search vs regular products)
  const priceData = product.priceRange?.minVariantPrice || variant?.price;

  return (
    <Link
      className="group flex flex-col gap-3 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      aria-label={product.title}
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
      <div className="aspect-4/5 overflow-hidden bg-brand-gray relative rounded-t-xl">
        {currentImage && (
          <Image
            alt={currentImage.altText || product.title}
            data={currentImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 50vw"
            className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-out"
          />
        )}

        {/* Hover arrows */}
        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveImageIndex((current) =>
                  current === 0 ? images.length - 1 : current - 1,
                );
              }}
              aria-label="Show previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-brand-black">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveImageIndex((current) =>
                  current === images.length - 1 ? 0 : current + 1,
                );
              }}
              aria-label="Show next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-brand-black">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6l6 6-6 6"
                  />
                </svg>
              </span>
            </button>
          </>
        ) : null}

        {!product.availableForSale && (
          <div className="absolute top-3 left-3 italic text-xs text-brand-black bg-brand-bg/90 px-2.5 py-1 z-10">
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
        className={`flex flex-col gap-1 px-4 pb-4 ${!product.availableForSale ? 'opacity-50' : ''}`}

      >
        <h4 className="font-inter text-md font-medium  tracking-[-0.01em] truncate text-brand-black">
          {product.title}
        </h4>
        <div className="font-assistant text-sm text-brand-muted">
          {priceData && <Money data={priceData} />}
        </div>
      </div>
    </Link>
  );
}

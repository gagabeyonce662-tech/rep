// app/routes/products.%24handle.tsx

// This is a route module for the product page, which is accessed via /products/:handle. It fetches the product data based on the handle, and renders the product page with the product details and related products. It also handles variant selection and updates the URL with the selected variant.


// imports: redirect and useLoaderData from react-router for handling data loading and redirection, and various components and utilities from the app and Hydrogen framework for rendering the product page and fetching data from the storefront API. 
// It also imports a utility function redirectIfHandleIsLocalized to handle redirection for localized product handles, and getSeoMeta for generating SEO metadata for the product page.


import { redirect, useLoaderData } from 'react-router';
import { ProductDescription } from '~/components/Product/ProductDescription';
import type { Route } from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  getSeoMeta,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/Product/ProductPrice';
import { ProductMedia } from '~/components/Product/ProductMedia';
import { ProductForm } from '~/components/Product/ProductForm';
import { ProductReviews } from '~/components/Product/ProductReviews';
import { RelatedProducts } from '~/components/Product/RelatedProducts';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

export const meta: Route.MetaFunction = ({ data, matches }) => {
  const product = data?.product;
  if (!product) return [{ title: 'Hydrogen | Product' }];

  const rootData = matches.find((match) => match.id === 'root')?.data as any;
  const baseUrl = rootData?.publicStoreDomain
    ? `https://${rootData.publicStoreDomain}`
    : '';

  const firstMedia = product.media?.nodes?.find(
    (m: any) => m.image || m.previewImage,
  );
  const firstImage =
    (firstMedia as any)?.image || (firstMedia as any)?.previewImage;

  return getSeoMeta({
    title: product.seo?.title ?? product.title,
    description: product.seo?.description ?? product.description,
    url: `${baseUrl}/products/${product.handle}`,
    media: firstImage
      ? {
        url: firstImage.url,
        width: firstImage.width,
        height: firstImage.height,
        altText: firstImage.altText || product.title,
      }
      : undefined,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.seo?.description ?? product.description,
      image: firstImage?.url,
      sku: product.selectedOrFirstAvailableVariant?.sku,
      offers: {
        '@type': 'Offer',
        price: product.selectedOrFirstAvailableVariant?.price?.amount,
        priceCurrency:
          product.selectedOrFirstAvailableVariant?.price?.currencyCode,
        availability: product.selectedOrFirstAvailableVariant?.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    },
  });
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData({
    ...args,
    product: criticalData.product,
  });

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({
  context,
  product,
}: Route.LoaderArgs & { product?: any }) {
  const recommended = context.storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: { productId: product.id },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return { recommended };
}

export default function Product() {
  const { product, recommended } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;
  const mediaNodes = product.media.nodes;
  const model3d = mediaNodes.find((m) => m.__typename === 'Model3d');
  const firstImageMedia = !model3d
    ? mediaNodes.find((m) => m.__typename === 'MediaImage' && m.image)
    : null;
  const pinnedMedia = model3d ?? firstImageMedia;
  const firstImage =
    firstImageMedia && firstImageMedia.__typename === 'MediaImage'
      ? firstImageMedia.image
      : null;
  const model3dGlbSrc =
    model3d && model3d.__typename === 'Model3d'
      ? (model3d.sources.find(
        (s) => s.mimeType === 'model/gltf-binary' || s.format === 'glb',
      )?.url ?? model3d.sources[0]?.url)
      : null;
  const scrollableMedia = mediaNodes.filter(
    (m) => !pinnedMedia || m.id !== pinnedMedia.id,
  );

  const hasMultipleImages = scrollableMedia.length > 0;

  return (
    <div className="w-full bg-brand-bg text-brand-black">
      <div className={`grid grid-cols-1 ${hasMultipleImages ? 'lg:grid-cols-[1.1fr_1fr_1fr]' : 'lg:grid-cols-[1fr_1.2fr]'} items-start`}>
        <div className="lg:sticky lg:top-0 h-[55vh] lg:h-screen overflow-hidden bg-brand-gray border-b border-brand-line lg:border-r lg:border-b-0">
          {model3dGlbSrc ? (
            <model-viewer
              src={model3dGlbSrc}
              poster={
                model3d && model3d.__typename === 'Model3d'
                  ? model3d.previewImage?.url
                  : undefined
              }
              camera-controls
              auto-rotate
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            />
          ) : firstImage ? (
            <Image
              data={firstImage}
              className="w-full h-full object-cover"
              sizes="40vw"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        {hasMultipleImages && (
          <div className="lg:py-6 lg:px-3 border-r border-brand-line">
            <ProductMedia media={scrollableMedia} />
          </div>
        )}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto product-main px-6 md:px-12 py-16 lg:py-20">
          <div className="max-w-md flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="font-serif italic text-sm text-brand-muted">
                {product.vendor}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.05] tracking-[-0.02em] text-brand-black">
                {title}
              </h1>
              <div className="text-lg font-light text-brand-black/80 pt-1">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
            </div>

            <div className="h-px w-full bg-brand-line" />

            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            <div className="h-px w-full bg-brand-line" />

            <ProductDescription html={descriptionHtml} />
          </div>
          <RelatedProducts recommended={recommended as any} />
        </div>
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_MEDIA_FRAGMENT = `#graphql
  fragment ProductMedia on Media {
    __typename
    ... on MediaImage {
      id
      image {
        url
        altText
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        url
        mimeType
        format
        height
        width
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
    ... on Model3d {
      id
      previewImage {
        url
      }
      sources {
        url
        mimeType
        format
      }
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    media(first: 15) {
      nodes {
        ...ProductMedia
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PRODUCT_MEDIA_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDATIONS_QUERY = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    availableForSale
  }
  query productRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductItem
    }
  }
` as const;

// app/routes/collections.%24handle.tsx

// This is a route module for the collection page, which is accessed via /collections/:handle. It fetches the collection data based on the handle, and renders the collection page with the collection details and products. It also handles pagination and filtering of products within the collection.

import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics, Image, getSeoMeta } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/Shared/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/Product/ProductItem';
import { CollectionFilters } from '~/components/Collection/CollectionFilters';
import {PageContainer} from '~/components/Layout/PageContainer';
import {PRODUCT_GRID_CLASS} from '~/components/Product/product-grid';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { getFiltersFromParams } from '~/lib/filter';
import type { Filter } from '@shopify/hydrogen/storefront-api-types';

export const meta: Route.MetaFunction = ({ data, matches }) => {
  const collection = data?.collection;
  if (!collection) return [{ title: 'Hydrogen | Collection' }];

  const rootData = matches.find((match) => match.id === 'root')?.data as any;
  const baseUrl = rootData?.publicStoreDomain ? `https://${rootData.publicStoreDomain}` : '';

  return getSeoMeta({
    title: collection.seo?.title ?? collection.title,
    description: collection.seo?.description ?? collection.description ?? 'Explore our collection',
    url: `${baseUrl}/collections/${collection.handle}`,
    media: collection.image ? {
      url: collection.image.url,
      width: collection.image.width,
      height: collection.image.height,
      altText: collection.image.altText || collection.title,
    } : undefined,
  }) ?? [];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const url = new URL(request.url);
  const filters = getFiltersFromParams(url.searchParams);

  if (!handle) {
    throw redirect('/collections');
  }

  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, filters, ...paginationVariables },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div className="collection bg-brand-bg font-assistant text-brand-black">
      <section className="relative w-full overflow-hidden bg-brand-gray">
        {collection.image && (
          <Image
            data={collection.image}
            className="absolute inset-0 w-full h-full object-cover"
            sizes="100vw"
          />
        )}
        {collection.image && (
          <div className="absolute inset-0 bg-black/20" />
        )}
        <div className="relative z-10 max-w-350 mx-auto p-6 flex flex-col gap-5">
          <span
            className={`font-inter italic text-lg ${collection.image ? 'text-white/80' : 'text-brand-muted'
              }`}
          >
            Collection
          </span>
          <h1
            className={`font-inter text-6xl md:text-8xl lg:text-9xl font-light tracking-[-0.03em] leading-[0.95] ${collection.image ? 'text-white' : 'text-brand-black'
              }`}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p
              className={`max-w-xl text-[15px] md:text-base leading-[1.7] font-light ${collection.image ? 'text-white/80' : 'text-brand-muted'
                }`}
            >
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <PageContainer as="section" className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div className="hidden lg:block sticky top-24 pb-8">
            <CollectionFilters filters={collection.products.filters as any} />
          </div>
          <div className="lg:hidden mb-8">
            {/* Mobile Filters Trigger Placeholder */}
            <div className="border border-brand-line p-4 text-center cursor-pointer hover:bg-brand-gray/50 transition-colors">
              <span className="font-inter">Filter Products</span>
            </div>
          </div>
          <div className="w-full">
            <PaginatedResourceSection<ProductItemFragment>
              connection={collection.products}
              resourcesClassName={PRODUCT_GRID_CLASS.collection}
            >
              {({ node: product, index }) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      </PageContainer>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
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
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

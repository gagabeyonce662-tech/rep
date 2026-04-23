import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, getSeoMeta} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/Shared/PaginatedResourceSection';
import {ProductItem} from '~/components/Product/ProductItem';
import {PageContainer} from '~/components/Layout/PageContainer';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({matches}) => {
  const rootData = matches.find((match) => match.id === 'root')?.data as any;
  const baseUrl = rootData?.publicStoreDomain ? `https://${rootData.publicStoreDomain}` : '';

  return getSeoMeta({
    title: 'All Products | Rep',
    description: 'Discover the complete collection of essential pieces from Rep. Made in small runs, finished by hand.',
    url: `${baseUrl}/collections/all`,
  });
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection bg-brand-bg font-assistant text-brand-black">
      <PageContainer as="section" className="px-6 md:px-8 lg:px-10 pt-28 md:pt-40 pb-16 flex flex-col gap-5">
        <span className="italic text-sm md:text-base text-brand-muted">
          Shop all
        </span>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[-0.03em] leading-[0.95] text-brand-black">
          All Products
        </h1>
        <div className="h-px w-full bg-brand-line mt-6" />
      </PageContainer>

      <PageContainer as="section" className="px-6 md:px-8 lg:px-10 pb-16 md:pb-24">
        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      </PageContainer>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    availableForSale
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/_index';
import { getSeoMeta } from '@shopify/hydrogen';
import Hero from '~/components/Hero';
import FeaturedSplit from '~/components/FeaturedSplit';
import Marquee from '~/components/Marquee';
import RecommendedProducts from '~/components/RecommendedProducts';
export const meta: Route.MetaFunction = () => {
  return (
    getSeoMeta({
      title: 'Rep | Official Store',
      description:
        'A considered edit of the season’s most essential pieces. Each silhouette made in small runs, finished by hand, and built to last.',
      titleTemplate: '%s | Rep Store',
    }) ?? []
  );
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
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home bg-brand-bg font-assistant text-brand-black">
      <Hero collection={data.featuredCollection} />
      <Marquee />
      <FeaturedSplit collection={data.featuredCollection} />
      <section className="md:px-8 py-24 md:py-32  ">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-brand-muted">
              Latest Arrivals
            </span>
            <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-[-0.04em] text-brand-black">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="group self-start md:self-end inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-black pb-1"
          >
            <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
              View all
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <RecommendedProducts products={data.recommendedProducts} />
      </section>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    availableForSale
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

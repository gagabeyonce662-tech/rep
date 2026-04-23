import { useLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import { getSeoMeta } from '@shopify/hydrogen';
import Hero from '~/components/Hero';
import FeaturedSplit from '~/components/FeaturedSplit';
import Marquee from '~/components/Marquee';
import { FEATURED_COLLECTION_QUERY, RECOMMENDED_PRODUCTS_QUERY, ALL_COLLECTIONS_WITH_PRODUCTS_QUERY } from '~/lib/queries';
import LatestArrivals from '~/components/LatestArrivals';
import CollectionsWithProducts from '~/components/Homepage/CollectionsWithProducts';


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
  const [{ collections }, { collections: featuredCollections }] = await Promise.all([
    context.storefront.query(ALL_COLLECTIONS_WITH_PRODUCTS_QUERY, {
      variables: {
        first: 6,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      }
    }),
    context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      }
    }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: featuredCollections.nodes[0],
    collectionsWithProducts: collections.nodes, // NEW
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
    <div className="home bg-brand-bg font-assistant text-brand-black ">
      <Hero collection={data.featuredCollection} />
      <Marquee />
      <div className="px-4 md:px-6 lg:px-8" >
        <FeaturedSplit collection={data.featuredCollection} />
        <CollectionsWithProducts collections={data.collectionsWithProducts} />
        <LatestArrivals products={data.recommendedProducts} />
      </div>
    </div>
  );
}


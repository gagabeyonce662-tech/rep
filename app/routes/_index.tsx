import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
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
function loadDeferredData({context}: Route.LoaderArgs) {
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
    <div className="home bg-white font-assistant">
      <Hero collection={data.featuredCollection} />
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-anton text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-2">
              New Arrivals
            </h2>
            <p className="text-brand-black/60 font-semibold uppercase tracking-widest text-xs">
              Latest Streetwear Drops
            </p>
          </div>
          <Link 
            to="/collections/all-products" 
            className="font-anton text-sm uppercase tracking-wider border-b-2 border-brand-black pb-1 hover:opacity-70 transition-opacity"
          >
            View All
          </Link>
        </div>
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
    </div>
  );
}

function Hero({collection}: {collection: FeaturedCollectionFragment}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <section className="relative h-[85vh] w-full bg-brand-black overflow-hidden group">
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            data={image}
            sizes="100vw"
            className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[3000ms] ease-out opacity-80"
            alt={image.altText || collection.title}
          />
        </div>
      )}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
        <h1 className="font-anton text-8xl md:text-[12rem] text-white uppercase tracking-tighter leading-[0.8] mb-8 drop-shadow-2xl">
          {collection.title}
        </h1>
        <Link
          to={`/collections/${collection.handle}`}
          className="bg-white text-brand-black px-12 py-4 font-anton uppercase tracking-widest text-lg hover:bg-brand-blue hover:text-white transition-colors animate-bounce"
        >
          Explore Drop
        </Link>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-white/50 animate-pulse font-assistant font-bold uppercase tracking-[0.3em] text-[10px]">
        Scroll to Discover
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 italic opacity-50">Loading Drops...</div>}>
      <Await resolve={products}>
        {(response) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {response
              ? response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
              : null}
          </div>
        )}
      </Await>
    </Suspense>
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

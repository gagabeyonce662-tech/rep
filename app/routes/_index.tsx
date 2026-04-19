import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, getSeoMeta} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/Product/ProductItem';
import {MockShopNotice} from '~/components/Shared/MockShopNotice';

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
    <div className="home bg-brand-bg font-assistant text-brand-black">
      <Hero collection={data.featuredCollection} />
      <Marquee />
      <FeaturedSplit collection={data.featuredCollection} />
      <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-24 md:py-32">
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

function Marquee() {
  const words = [
    'Rep',
    '◦',
    'Worldwide',
    '◦',
    'Limited Edition',
    '◦',
    'Crafted with Care',
    '◦',
  ];
  const loop = Array.from({length: 4}, (_, i) =>
    words.map((w, j) => ({id: `${i}-${j}-${w}`, word: w})),
  ).flat();
  return (
    <section className="border-y border-brand-line py-6 md:py-8 overflow-hidden bg-brand-bg">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {loop.map((item) => (
          <span
            key={item.id}
            className="text-3xl md:text-5xl font-semibold uppercase tracking-[0.08em] px-6 md:px-10 text-brand-black"
          >
            {item.word}
          </span>
        ))}
      </div>
    </section>
  );
}

function FeaturedSplit({collection}: {collection: FeaturedCollectionFragment}) {
  if (!collection?.image) return null;
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-stretch bg-brand-bg">
      <div className="relative aspect-square md:aspect-auto md:min-h-[85vh] overflow-hidden bg-brand-gray group">
        <Image
          data={collection.image}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
          sizes="50vw"
        />
      </div>
      <div className="flex items-center justify-center px-6 md:px-20 py-20 md:py-28 bg-brand-bg">
        <div className="max-w-md flex flex-col gap-7">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-brand-muted">
            Featured Collection
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-[-0.04em] text-brand-black">
            {collection.title}
          </h2>
          <p className="text-[15px] text-brand-muted leading-[1.7] font-light">
            A considered edit of the season&rsquo;s most essential pieces. Each
            silhouette made in small runs, finished by hand, and built to last.
          </p>
          <Link
            to={`/collections/${collection.handle}`}
            className="group self-start inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-black mt-2"
          >
            <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
              Shop the collection
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import {Button} from '~/components/ui/Button';

function Hero({collection}: {collection: FeaturedCollectionFragment}) {
  if (!collection) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden group">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/Model_hero-upscaled.png"
          className="object-cover w-full h-full scale-110 group-[]:scale-100 motion-safe:animate-hero-zoom"
          alt="Collection Background"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-linear-to-b from-black/10 via-transparent to-black/50" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <span className="text-sm md:text-base font-medium uppercase tracking-[0.22em] text-white/85 mb-5 motion-safe:animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          Featured Collection
        </span>
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-white font-semibold tracking-[-0.05em] leading-[0.9] mb-10 motion-safe:animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          {collection.title}
        </h1>
        <div className="motion-safe:animate-fade-up [animation-delay:700ms] opacity-0 [animation-fill-mode:forwards]">
          <Button to={`/collections/${collection.handle}`} variant="white">
            Explore Drop
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/60 font-assistant uppercase tracking-[0.3em] text-[10px]">
        <span>Scroll</span>
        <span className="block w-px h-10 bg-white/40 overflow-hidden relative">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white motion-safe:animate-scroll-hint" />
        </span>
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
    <Suspense
      fallback={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 italic opacity-50">
          Loading Drops...
        </div>
      }
    >
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

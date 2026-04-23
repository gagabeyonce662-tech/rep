import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {ProductCard} from '~/components/Product/ProductCard';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl md:text-3xl font-light leading-[1.05] tracking-[-0.02em] text-brand-black mb-6">
        Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="group block p-6 border border-brand-line hover:border-brand-black transition-colors duration-500"
            >
              <h3 className="text-lg font-light leading-snug tracking-[-0.01em] text-brand-black group-hover:text-brand-muted transition-colors duration-500">
                {article.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl md:text-3xl font-light leading-[1.05] tracking-[-0.02em] text-brand-black mb-6">
        Pages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="group block p-6 border border-brand-line hover:border-brand-black transition-colors duration-500"
            >
              <h3 className="text-lg font-light leading-snug tracking-[-0.01em] text-brand-black group-hover:text-brand-muted transition-colors duration-500">
                {page.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl md:text-3xl font-light leading-[1.05] tracking-[-0.02em] text-brand-black mb-8">
        Products
      </h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
              {nodes.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist={true}
                />
              ))}
            </div>

            {(PreviousLink || NextLink) && (
              <div className="flex justify-center items-center gap-8 pt-8">
                {PreviousLink && (
                  <PreviousLink className="group inline-flex items-center gap-3 italic text-sm text-brand-black pb-1">
                    <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
                      Previous
                    </span>
                    <span className="transition-transform duration-500 group-hover:-translate-x-1">
                      ←
                    </span>
                  </PreviousLink>
                )}
                {NextLink && (
                  <NextLink className="group inline-flex items-center gap-3 italic text-sm text-brand-black pb-1">
                    <span className="border-b border-brand-line group-hover:border-brand-black pb-1 transition-colors duration-500">
                      Next
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </NextLink>
                )}
              </div>
            )}
          </div>
        )}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-16">
      <p className="font-assistant text-brand-muted text-lg">
        No results found. Try a different search term.
      </p>
    </div>
  );
}

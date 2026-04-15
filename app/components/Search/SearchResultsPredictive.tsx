import {Link, useFetcher, type Fetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from '~/components/Layout/Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <div className="space-y-4 mb-8" key="articles">
      <h5 className="font-serif italic text-sm text-brand-muted">Articles</h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li key={article.id}>
              <Link 
                onClick={closeSearch} 
                to={articleUrl}
                className="flex items-center gap-4 group"
              >
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                    className="object-cover border border-brand-black/5"
                  />
                )}
                <span className="font-assistant font-bold text-sm group-hover:underline italic uppercase">{article.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="space-y-4 mb-8" key="collections">
      <h5 className="font-serif italic text-sm text-brand-muted">Collections</h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li key={collection.id}>
              <Link 
                onClick={closeSearch} 
                to={collectionUrl}
                className="flex items-center gap-4 group"
              >
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={50}
                    height={50}
                    className="object-cover border border-brand-black/5"
                  />
                )}
                <span className="font-assistant font-bold text-sm group-hover:underline italic uppercase">{collection.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="space-y-4 mb-8" key="pages">
      <h5 className="font-serif italic text-sm text-brand-muted">Pages</h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li key={page.id}>
              <Link 
                onClick={closeSearch} 
                to={pageUrl}
                className="font-assistant font-bold text-sm hover:underline italic uppercase"
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="space-y-4 mb-8" key="products">
      <h5 className="font-serif italic text-sm text-brand-muted">Products</h5>
      <ul className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const variant = product?.selectedOrFirstAvailableVariant;
          const price = variant?.price;
          const compareAtPrice = variant?.compareAtPrice;
          const image = variant?.image;
          const available = variant?.availableForSale ?? true;

          return (
            <li key={product.id}>
              <Link to={productUrl} onClick={closeSearch} className="group block">
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-brand-gray/40 mb-2">
                  {image ? (
                    <Image
                      alt={image.altText ?? product.title}
                      src={image.url}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-brand-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {!available && (
                    <span className="absolute top-2 left-2 text-[10px] font-assistant font-bold uppercase tracking-wider bg-brand-black text-white px-1.5 py-0.5 leading-none">
                      Sold out
                    </span>
                  )}
                </div>

                {/* Info */}
                <p className="font-assistant text-[11px] font-semibold uppercase tracking-wide leading-tight group-hover:underline line-clamp-2 mb-1">
                  {highlightTerm(product.title, term.current)}
                </p>
                <div className="flex items-baseline gap-1.5">
                  {price && (
                    <span className="font-assistant text-xs text-brand-black">
                      <Money data={price} />
                    </span>
                  )}
                  {compareAtPrice && compareAtPrice.amount !== price?.amount && (
                    <span className="font-assistant text-[11px] text-brand-muted line-through">
                      <Money data={compareAtPrice} />
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <div className="p-8 text-center bg-brand-gray/30 mt-8">
      <p className="font-assistant text-sm italic opacity-60 uppercase tracking-widest">
        No results found for <q className="not-italic font-bold text-brand-black">{term.current}</q>
      </p>
    </div>
  );
}

/**
 * Wraps matched substrings in a <mark> highlight element.
 */
function highlightTerm(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  try {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-brand-accent/20 text-brand-black not-italic px-px rounded-sm"
        >
          {part}
        </mark>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );
  } catch {
    return text;
  }
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}

import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Layout/Aside';
import {Footer} from '~/components/Layout/Footer';
import {Header, HeaderMenu} from '~/components/Layout/Header';
import {CartMain} from '~/components/Cart/CartMain';
import {MobileBottomNav} from '~/components/Layout/MobileBottomNav';
import {NewsletterModal} from '~/components/Layout/NewsletterModal';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/Search/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/Search/SearchResultsPredictive';
import {Button} from '~/components/ui/Button';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <NotificationsAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="pb-28 md:pb-0">{children}</main>
      <NewsletterModal />
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
      <MobileBottomNav />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="flex flex-col h-full font-assistant">
        <br />
        <SearchFormPredictive className="sticky top-0 bg-white pb-4 z-10">
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex gap-2">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="flex-1 bg-transparent border border-brand-black/10 px-4 py-2 text-sm focus:border-brand-black outline-none transition-colors"
              />
              <Button onClick={goToSearch} variant="secondary" className="px-6 py-2">
                Search
              </Button>
            </div>
          )}
        </SearchFormPredictive>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-black/10">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              if (state === 'loading' && term.current) {
                return (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                  </div>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <div className="pt-4 pb-20">
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Button
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      variant="primary"
                      className="w-full mt-4"
                    >
                      View all {total} results
                    </Button>
                  ) : null}
                </div>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

function NotificationsAside() {
  return (
    <Aside type="notifications" heading="Notifications">
      <div className="flex flex-col gap-6 p-2 text-brand-black">
        <div className="border-b border-brand-line pb-5">
          <p className="text-xl font-light leading-snug">Winter Drop Live</p>
          <p className="text-sm text-brand-muted mt-1">Shop the new arrivals now.</p>
        </div>
        <div className="border-b border-brand-line pb-5">
          <p className="text-xl font-light leading-snug">2 New Messages</p>
          <p className="text-sm text-brand-muted mt-1">Your order #1234 has been shipped.</p>
        </div>
      </div>
    </Aside>
  );
}

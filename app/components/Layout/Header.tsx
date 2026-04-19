import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Layout/Aside';
import {useWishlist} from '~/lib/useWishlist';
import {SearchFormPredictive} from '~/components/Search/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/Search/SearchResultsPredictive';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const {open} = useAside();
  const {pathname} = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === '/' || pathname.endsWith('/');
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const offset =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      setIsScrolled(offset > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${isHome ? 'fixed' : 'sticky'} ${isTransparent ? 'bg-transparent border-none text-white' : 'bg-brand-bg/90 backdrop-blur-sm border-b border-brand-line text-brand-black'} top-0 z-50 flex h-16 w-full items-center px-4 md:px-8 transition-all duration-500`}
    >
      {/* Left: Desktop Menu */}
      <div className="flex-1 hidden md:block">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </div>

      {/* Center: Brand + Toggle */}
      <div className="flex items-center justify-center flex-1 gap-4 md:flex-initial">
        <button
          className={`group relative flex items-center justify-center w-8 h-8 border ${isTransparent ? 'border-white/30 hover:bg-white hover:text-brand-black' : 'border-brand-black/20 hover:bg-brand-black hover:text-white'} transition-colors duration-300`}
          onClick={() => open('notifications')}
        >
          <span className="font-bold text-xl leading-none group-hover:rotate-90 transition-transform">
            +
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-brand-blue text-[10px] text-white">
            2
          </span>
        </button>

        <NavLink prefetch="intent" to="/" className="flex items-center" end>
          <span className="font-serif italic text-2xl font-light tracking-[-0.02em] whitespace-nowrap">
            Rep
          </span>
        </NavLink>
      </div>

      {/* Right: CTAs */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <HeaderCtas
          isLoggedIn={isLoggedIn}
          cart={cart}
          isTransparent={isTransparent}
        />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <nav className="flex items-center gap-6" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="font-assistant text-sm font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  isTransparent,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {isTransparent: boolean}) {
  const {open} = useAside();

  return (
    <nav className="flex items-center gap-4" role="navigation">
      <button
        type="button"
        onClick={() => open('search')}
        aria-label="Open search"
        className={`flex items-center justify-center w-8 h-8 border ${isTransparent ? 'border-white/30 hover:bg-white hover:text-brand-black' : 'border-brand-black/20 hover:bg-brand-black hover:text-white'} transition-colors duration-300`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 10.5a7.5 7.5 0 0012.9 6.15z"
          />
        </svg>
      </button>
      <NavLink prefetch="intent" to="/account" className="hidden md:block">
        <Suspense fallback="...">
          <Await resolve={isLoggedIn}>
            {(isLoggedIn) => (
              <svg
                className="w-5 h-5 opacity-70 hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </Await>
        </Suspense>
      </NavLink>
      <HeaderWishlist />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderWishlist() {
  const {wishlistItems} = useWishlist();

  return (
    <NavLink
      prefetch="intent"
      to="/wishlist"
      className="relative flex items-center gap-2 group"
      onClick={(e) => {
        // Temporarily alert since we don't have a /wishlist page yet
        e.preventDefault();
        alert(
          `Wishlist contains ${wishlistItems.length} products. A dedicated Wishlist page will be added.`,
        );
      }}
    >
      <div className="w-6 h-6 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </div>
      {wishlistItems.length > 0 && (
        <span className="text-[10px] font-assistant font-bold absolute -top-1.5 -right-1.5 bg-brand-blue text-white w-4 h-4 flex items-center justify-center rounded-full">
          {wishlistItems.length}
        </span>
      )}
    </NavLink>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative flex items-center gap-2 group"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <div className="w-8 h-8 relative grayscale-[0.8] group-hover:grayscale-0 transition-all">
        <model-viewer
          src="https://cdn.shopify.com/3d/models/35a63c6b41ec48a1/WHITE_BLUEORNG.glb"
          camera-controls
          auto-rotate
          interaction-prompt="none"
          style={{width: '100%', height: '100%', background: 'transparent'}}
        ></model-viewer>
      </div>
      <span className="text-[10px] font-assistant font-bold absolute -top-1 -right-1 bg-brand-blue text-white w-4 h-4 flex items-center justify-center">
        {count}
      </span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          return <CartBanner cart={cart} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBanner({cart}: {cart: CartApiQueryFragment | null}) {
  const optimisticCart = useOptimisticCart(cart);
  return <CartBadge count={optimisticCart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

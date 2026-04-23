import {Suspense, useState} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-brand-black">
            <NewsletterBanner shopName={header.shop.name} />

            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Brand column */}
                <div>
                  <p className="italic text-xl font-light text-white tracking-tight mb-3">
                    {header.shop.name}
                  </p>
                  <p className="font-assistant text-sm text-white/40 leading-relaxed max-w-[200px]">
                    Curated pieces for the discerning wardrobe.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <SocialLink href="#" label="Instagram">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </SocialLink>
                    <SocialLink href="#" label="Pinterest">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </SocialLink>
                    <SocialLink href="#" label="Facebook">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </SocialLink>
                  </div>
                </div>

                {/* Spacer */}
                <div />

                {/* Policies */}
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <div>
                    <p className="font-assistant text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-5">
                      Legal
                    </p>
                    <FooterMenu
                      menu={footer.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
                <p className="font-assistant text-xs text-white/25">
                  © {new Date().getFullYear()} {header.shop.name}. All rights
                  reserved.
                </p>
                <p className="font-assistant text-xs text-white/15">
                  Built with care.
                </p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Newsletter banner
// ---------------------------------------------------------------------------

function NewsletterBanner({shopName}: {shopName: string}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    // TODO: POST to your email provider (Klaviyo / Mailchimp / Shopify marketing)
    setStatus('success');
  }

  return (
    <div className="border-b border-white/8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
          {/* Headline */}
          <div className="max-w-xs">
            <h2 className="italic text-3xl md:text-4xl font-light text-white leading-tight tracking-tight mb-2">
              Join the story.
            </h2>
            <p className="font-assistant text-sm text-white/40 leading-relaxed">
              Be first to know about new arrivals, exclusive drops, and private
              offers.
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 max-w-md">
            {status === 'success' ? (
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-white/50 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="italic text-lg font-light text-white">
                    You're on the list.
                  </p>
                  <p className="font-assistant text-xs text-white/40 mt-0.5">
                    Welcome to the circle.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex items-end gap-6">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="Your email address"
                      className={`w-full bg-transparent border-b ${
                        status === 'error'
                          ? 'border-red-400'
                          : 'border-white/25'
                      } pb-2.5 text-sm font-assistant text-white placeholder-white/25 outline-none focus:border-white/60 transition-colors`}
                    />
                    {status === 'error' && (
                      <p className="font-assistant text-xs text-red-400 mt-2">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 font-assistant text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors pb-2.5 whitespace-nowrap"
                  >
                    Subscribe →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer menu
// ---------------------------------------------------------------------------

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <ul className="space-y-2.5">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <li key={item.id}>
            <a
              href={url}
              rel="noopener noreferrer"
              target="_blank"
              className="font-assistant text-sm text-white/40 hover:text-white transition-colors"
            >
              {item.title}
            </a>
          </li>
        ) : (
          <li key={item.id}>
            <NavLink
              end
              prefetch="intent"
              to={url}
              className="font-assistant text-sm text-white/40 hover:text-white transition-colors"
            >
              {item.title}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Social link
// ---------------------------------------------------------------------------

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/40 hover:border-white/50 hover:text-white transition-colors"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {children}
      </svg>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Fallback menu
// ---------------------------------------------------------------------------

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

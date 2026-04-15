import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router';
import {capturePageView, captureEvent, initPostHog} from '~/lib/posthog.client';

/**
 * Mounted once in root.tsx. Handles:
 *  - PostHog initialisation
 *  - Page view capture on every navigation
 *  - Global delegated click tracking (data-track attributes + semantic elements)
 */
export function ClickTracker() {
  const location = useLocation();
  const initialized = useRef(false);

  // Init once on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initPostHog();
  }, []);

  // Page view on every route change
  useEffect(() => {
    capturePageView(window.location.href);
  }, [location.pathname, location.search]);

  // Global click delegation
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Walk up the DOM to find the nearest trackable element
      const el = target.closest<HTMLElement>(
        'a[href], button, [data-track], [data-track-event]',
      );
      if (!el) return;

      // Explicit override via data-track-event="my_event"
      const explicitEvent = el.dataset.trackEvent;
      if (explicitEvent) {
        captureEvent(explicitEvent, buildProps(el));
        return;
      }

      // data-track="false" → opt-out
      if (el.dataset.track === 'false') return;

      // Classify the element
      const tag = el.tagName.toLowerCase();
      const href = (el as HTMLAnchorElement).href ?? '';
      const isExternal =
        href && !href.startsWith(window.location.origin) && href.startsWith('http');
      const isNav = !!el.closest('nav, header');
      const isCart = !!el.closest('[data-cart], form[action*="cart"]');

      let eventName = 'click';

      if (isExternal) eventName = 'outbound_link_click';
      else if (isCart) eventName = 'cart_interaction';
      else if (isNav) eventName = 'nav_click';
      else if (tag === 'a') eventName = 'link_click';
      else if (tag === 'button') eventName = 'button_click';

      captureEvent(eventName, buildProps(el));
    }

    document.addEventListener('click', handleClick, {capture: true, passive: true});
    return () => document.removeEventListener('click', handleClick, {capture: true});
  }, []);

  return null;
}

function buildProps(el: HTMLElement): Record<string, unknown> {
  const anchor = el as HTMLAnchorElement;
  return {
    text: el.innerText?.trim().slice(0, 120) || el.getAttribute('aria-label') || undefined,
    href: anchor.href || undefined,
    element: el.tagName.toLowerCase(),
    path: window.location.pathname,
    dataset: el.dataset.track ? {track: el.dataset.track} : undefined,
  };
}

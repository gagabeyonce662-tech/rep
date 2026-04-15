import posthog from 'posthog-js';

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === 'undefined') return;

  const key = window.__ENV?.PUBLIC_POSTHOG_KEY;
  const host = window.__ENV?.PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false, // we fire these manually on navigation
    capture_pageleave: true,
    autocapture: {
      // capture all clicks, but exclude noisy internal elements
      dom_event_allowlist: ['click'],
      element_allowlist: ['a', 'button', 'input', 'select', 'textarea', 'label'],
      css_selector_allowlist: ['[data-track]'],
    },
    session_recording: {
      maskAllInputs: true,
    },
  });

  initialized = true;
}

export function capturePageView(url: string) {
  if (typeof window === 'undefined' || !initialized) return;
  posthog.capture('$pageview', {$current_url: url});
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === 'undefined' || !initialized) return;
  posthog.capture(event, properties);
}

export {posthog};

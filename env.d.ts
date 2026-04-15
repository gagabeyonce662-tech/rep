/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

declare global {
  interface Env extends HydrogenEnv {
    PUBLIC_POSTHOG_KEY: string;
    PUBLIC_POSTHOG_HOST: string;
  }
  interface Window {
    __ENV?: {
      PUBLIC_POSTHOG_KEY: string;
      PUBLIC_POSTHOG_HOST: string;
    };
  }
}

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

// model-viewer web component JSX types
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      poster?: string;
      alt?: string;
      'camera-controls'?: boolean | string;
      'auto-rotate'?: boolean | string;
      'interaction-prompt'?: string;
      style?: React.CSSProperties;
    };
  }
}

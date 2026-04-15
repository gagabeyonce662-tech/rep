import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      'self',
      'https://cdn.shopify.com',
      'https://images.unsplash.com',
      'data:',
      'http://localhost:*',
    ],
    scriptSrc: [
      'self',
      'https://cdn.shopify.com',
      'https://cdn.jsdelivr.net',
      'https://shop.app',
      'http://localhost:*',
      "'unsafe-eval'",
      'blob:',
    ],
    workerSrc: ["'self'", 'blob:'],
    connectSrc: [
      'self',
      'https://cdn.shopify.com',
      'https://monorail-edge.shopifysvc.com',
      'https://cdn.jsdelivr.net',
      'https://www.gstatic.com',
      'http://localhost:*',
      'ws://localhost:*',
      'blob:',
    ],
    styleSrc: [
      'self',
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
      'http://localhost:*',
    ],
    fontSrc: [
      'self',
      'https://fonts.gstatic.com',
      'http://localhost:*',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

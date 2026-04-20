import { createHydrogenContext } from '@shopify/hydrogen';
import { AppSession } from '~/lib/session';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';

function validateEnv(env: Env) {
  const required = ['SESSION_SECRET', 'PUBLIC_STOREFRONT_API_TOKEN'];
  for (const key of required) {
    if (!env[key as keyof Env]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

// Define the additional context object
const additionalContext = {
} as const;

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {

  validateEnv(env);

  const waitUntil = (promise: Promise<any>) => {
    return executionContext?.waitUntil
      ? executionContext.waitUntil(promise)
      : undefined;
  };

  const [cache, session] = await Promise.all([
    typeof caches !== 'undefined'
      ? caches.open('hydrogen')
      : Promise.resolve(undefined),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: { language: 'EN', country: 'US' },
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}

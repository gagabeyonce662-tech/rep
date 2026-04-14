import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
const entry = {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      /**
       * In Vercel, environment variables are available on process.env.
       * In Oxygen, they are passed as the second argument to the fetch handler.
       * We merge them here to ensure compatibility across platforms.
       */
      const mergedEnv = {
        ...(typeof process !== 'undefined' ? process.env : {}),
        ...env,
      } as unknown as Env;

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        mergedEnv,
        executionContext,
      );

      /**
       * Create a Hydrogen request handler that internally
       * delegates to React Router for routing and rendering.
       */
      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: mergedEnv.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Server error:', error);
      return new Response(
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        {status: 500},
      );
    }
  },
};

export default entry;


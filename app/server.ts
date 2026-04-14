import {createRequestHandler} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';
import type {Env} from '~/env';
import * as serverBuild from 'virtual:react-router/server-build';

/**
 * Node.js server entry point for Hydrogen + React Router
 */
export const handler = async (request: Request) => {
  const env = {
    ...process.env,
  } as unknown as Env;

  // Create the full Hydrogen context (sessions, cache, etc.)
  const hydrogenContext = await createHydrogenRouterContext(
    request,
    env,
    {
      waitUntil: (promise: Promise<any>) => {
        // In Node.js, we just let the promise run or handle it differently
        promise.catch(console.error);
      },
    } as ExecutionContext,
  );

  /**
   * Create a Hydrogen request handler that internally
   * delegates to React Router for routing and rendering.
   */
  const handleRequest = createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
    getLoadContext: () => hydrogenContext,
  });

  const response = await handleRequest(request);

  // Commit session if pending
  if (hydrogenContext.session.isPending) {
    response.headers.append(
      'Set-Cookie',
      await hydrogenContext.session.commit(),
    );
  }

  return response;
};

/**
 * Local Node.js server listener.
 * This part executes when the file is run directly by Node.
 */
async function startServer() {
  const port = process.env.PORT || 3000;
  const {createServer} = await import('node:http');
  const {Request, Headers} = await import('undici'); // Node 18+ web standards

  const server = createServer(async (req, res) => {
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const url = new URL(req.url || '/', `${protocol}://${req.headers.host}`);
      
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, value);
          }
        }
      }

      const request = new Request(url.toString(), {
        method: req.method,
        headers,
        // Body handling would go here for POST/PUT
      });

      const response = await handler(request);

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
    } catch (error) {
      console.error('Server error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}`);
  });
}

// Start the server if targeted for node and not on Oxygen/Vercel (which uses the handler export)
if (process.env.HYDROGEN_DEPLOYMENT_TARGET === 'node') {
  startServer().catch(console.error);
}

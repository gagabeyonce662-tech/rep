import 'dotenv/config';
import {createRequestHandler} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';
import type {Env} from '../env';
import * as serverBuild from 'virtual:react-router/server-build';

/**
 * Node.js server entry point for Hydrogen + React Router
 */
export const handler = async (request: Request) => {
  console.log('[handler] START - Request:', request.method, request.url);

  const env = {
    ...process.env,
  } as unknown as Env;
  console.log(
    '[handler] Env loaded - SESSION_SECRET exists:',
    !!env.SESSION_SECRET,
  );

  // Create the full Hydrogen context (sessions, cache, etc.)
  console.log('[handler] Creating Hydrogen context...');
  const hydrogenContext = await createHydrogenRouterContext(request, env, {
    waitUntil: (promise: Promise<any>) => {
      // In Node.js, we just let the promise run or handle it differently
      promise.catch(console.error);
    },
  } as ExecutionContext);
  console.log('[handler] Hydrogen context created ✓');

  /**
   * Create a Hydrogen request handler that internally
   * delegates to React Router for routing and rendering.
   */
  const handleRequest = createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
    getLoadContext: () => hydrogenContext,
  });
  console.log('[handler] Request handler created ✓');

  const response = await handleRequest(request);
  console.log('[handler] Response received - Status:', response.status);

  // Commit session if pending
  if (hydrogenContext.session.isPending) {
    console.log('[handler] Session pending - committing...');
    response.headers.append(
      'Set-Cookie',
      await hydrogenContext.session.commit(),
    );
  }

  console.log('[handler] END - Returning response');
};

/**
 * Local Node.js server listener.
 * This part executes when the file is run directly by Node.
 */
async function startServer() {
  console.log('[startServer] Initializing...');
  const port = process.env.PORT || 3000;
  console.log('[startServer] Port:', port);
  const {createServer} = await import('node:http');
  const {Request, Headers} = await import('undici'); // Node 18+ web standards

  const server = createServer(async (req, res) => {
    console.log('[request] Incoming:', req.method, req.url);
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const url = new URL(req.url || '/', `${protocol}://${req.headers.host}`);
      console.log('[request] URL parsed:', url.toString());

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

      console.log('[request] Handler returned - Status:', response.status);
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
      console.log('[request] Response sent ✓');
    } catch (error) {
      console.error('[request] Error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, () => {
    console.log(`[startServer] ✓ Server running on http://localhost:${port}`);
  });
}

// Start the server if targeted for node and not on Oxygen/Vercel (which uses the handler export)
if (process.env.HYDROGEN_DEPLOYMENT_TARGET === 'node') {
  startServer().catch(console.error);
}

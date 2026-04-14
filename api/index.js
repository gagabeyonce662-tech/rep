import worker from '../dist/server/index.js';

export const config = {
  runtime: 'edge', // Run beautifully on Vercel Edge Network
};

export default async function handler(request, event) {
  // Pass the Vercel Edge context accurately so Hydrogen loads Storefront properly
  return worker.fetch(request, { ...process.env }, {
    waitUntil: (promise) => event.waitUntil(promise)
  });
}

import type { Config } from '@react-router/dev/config';
import { hydrogenPreset } from '@shopify/hydrogen/react-router-preset';

/**
 * React Router 7.9.x Configuration for Hydrogen
 *
 * This configuration uses the official Hydrogen preset to provide optimal
 * React Router settings for Shopify Oxygen deployment. The preset enables
 * validated performance optimizations while ensuring compatibility.
 */

const isNode = process.env.HYDROGEN_DEPLOYMENT_TARGET === 'node';

export default {
  presets: [hydrogenPreset()],
  future: {
    v8_middleware: true,
  },
} satisfies Config;

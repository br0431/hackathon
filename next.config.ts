import type { NextConfig } from "next";

import { validateEnv } from "./lib/env/schema";

// Las variables de entorno se validan al arrancar `next dev`, `next build` y `next start`.
// SKIP_ENV_VALIDATION=1 solo se usa en CI para lint, tipos y tests, que no necesitan claves.
if (process.env.SKIP_ENV_VALIDATION !== "1") {
  validateEnv(process.env);
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

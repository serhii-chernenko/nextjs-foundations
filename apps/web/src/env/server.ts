// 'server-only' throws a build-time error if this module is ever imported in
// a client bundle or edge function. It works by exporting a special condition
// that webpack/Turbopack recognises as browser-incompatible.
import 'server-only';

import { z } from 'zod';

import { clientEnv } from './client';

const serverSchema = z.object({
  // Optional with a fallback so dev builds work without a full .env.local.
  INTERNAL_CONFIG: z.string().default('default'),
  // DATABASE_URL is optional — not required for dev/demo purposes.
  DATABASE_URL: z.string().optional(),
});

const serverVars = serverSchema.parse({
  INTERNAL_CONFIG: process.env.INTERNAL_CONFIG,
  DATABASE_URL: process.env.DATABASE_URL,
});

// Merge client + server vars into a single typed object.
// Import this in Server Components, API routes, and server-side utilities.
export const env = {
  ...clientEnv,
  ...serverVars,
} as const;

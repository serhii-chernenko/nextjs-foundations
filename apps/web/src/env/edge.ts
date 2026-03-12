// Edge-compatible env — intentionally does NOT import 'server-only'.
//
// The 'server-only' package uses a package.json export condition ("browser"
// / "worker") that throws an error in edge runtimes. Next.js middleware
// runs in the Edge runtime (not Node.js), so 'server-only' cannot be used
// here even though this code never runs in a browser.
//
// Rule: only include vars that are safe to access from the edge runtime.
// Secrets tied to Node.js-only resources (e.g. a pg client) must stay in
// env/server.ts and never be imported into middleware.
import { z } from 'zod';

import { clientEnv } from './client';

const edgeSchema = z.object({
  INTERNAL_CONFIG: z.string().default('default'),
});

const result = edgeSchema.safeParse({
  INTERNAL_CONFIG: process.env.INTERNAL_CONFIG,
});

// Export the raw safeParse result so middleware can return a descriptive
// error response instead of letting Next.js crash with a generic 500.
export const edgeEnvResult = result;

// Convenience accessor — null when validation failed.
export const edgeEnv = result.success
  ? { ...clientEnv, ...result.data }
  : null;

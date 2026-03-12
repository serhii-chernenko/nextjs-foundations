import { z } from 'zod';

// NEXT_PUBLIC_* vars are inlined into the JavaScript bundle at BUILD TIME.
// They must be present when `next build` runs, not just at runtime.
// This module is safe to import in any context: client components, server
// components, and edge middleware.
const schema = z.object({
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_APP_NAME must not be empty'),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
});

export const clientEnv = schema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

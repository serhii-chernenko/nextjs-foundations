import { z } from 'zod';

// Blog app environment variables.
// Only NEXT_PUBLIC_* vars are needed here (no server secrets in the blog app).
// These are inlined at build time, so they must be set during `next build`.
const schema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('VAF Blog'),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3001'),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

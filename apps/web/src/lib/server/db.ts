import 'server-only';

import { env } from '@/env/server';

// Simulate a database call that uses server secrets
export function getUserFromDB(userId: string) {
  // env.INTERNAL_CONFIG is validated at startup — guaranteed to be a string.
  const config = env.INTERNAL_CONFIG;
 
  // Simulated database response with sensitive fields
  return {
    id: userId,
    email: "user@example.com",
    passwordHash: "bcrypt$2b$10$...", // NEVER expose this
    internalNotes: `VIP customer (config: ${config})`, // NEVER expose this
    name: "Jane Developer",
    createdAt: new Date().toISOString(),
  };
}
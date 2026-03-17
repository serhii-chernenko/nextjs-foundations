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

// Mock database interface for demo purposes
export const db = {
  post: {
    create: async (params: { data: { title: string; content: string } }) => {
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate a slug from title
      const slug = params.data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      return {
        id: Math.random().toString(36).slice(2),
        slug,
        title: params.data.title,
        content: params.data.content,
        createdAt: new Date(),
      };
    },
  },
};
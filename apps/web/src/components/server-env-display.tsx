import { env } from '@/env/server';

export function ServerEnvDisplay() {
  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Server Component</h3>
      <p>Public: {env.NEXT_PUBLIC_APP_NAME}</p>
      <p>Server-only: {env.INTERNAL_CONFIG}</p>
    </div>
  );
}

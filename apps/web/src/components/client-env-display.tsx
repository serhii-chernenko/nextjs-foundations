'use client';

import { useState } from 'react';

import { clientEnv } from '@/env/client';

export function ClientEnvDisplay() {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => setClicks(clicks + 1);

  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Client Component</h3>
      <p>Public: {clientEnv.NEXT_PUBLIC_APP_NAME}</p>
      {/* INTERNAL_CONFIG is not available in client env — intentional */}
      <p>Server-only: undefined</p>
      <button
        className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        onClick={handleClick}
        type="button"
      >
        Clicked {clicks} times
      </button>
    </div>
  );
}

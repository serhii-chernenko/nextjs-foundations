'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      onClick={() => setCount(count + 1)}
      type="button"
    >
      Count: {count}
    </button>
  );
}

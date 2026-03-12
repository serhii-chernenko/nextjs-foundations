'use client';

import { useEffect } from 'react';

export default function ErrorDemoBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Intentional for error reporting demonstration
    console.error('Error demo boundary caught:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
        <h2 className="mb-2 font-bold text-orange-800 text-xl">
          Demo Error Caught!
        </h2>
        <p className="mb-4 text-orange-700">
          This error was caught by the nested error boundary in /error-demo.
        </p>
        <p className="mb-4 font-mono text-orange-600 text-sm">
          {error.message}
        </p>
        <div className="flex gap-3">
          <button
            className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
            onClick={reset}
            type="button"
          >
            Try Again
          </button>
          <a
            className="rounded border border-orange-600 px-4 py-2 text-orange-600 hover:bg-orange-100"
            href="/error-demo"
          >
            Reload Page
          </a>
        </div>
      </div>
    </div>
  );
}

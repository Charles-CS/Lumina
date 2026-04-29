'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030303] text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Runtime Error</p>
        <h1 className="mt-3 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/65">
          The page hit an unexpected error. You can retry without reloading the whole app.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-white text-black px-4 text-sm font-medium hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

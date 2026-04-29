'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-6">
        <main className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Critical Error</p>
          <h1 className="mt-3 text-2xl font-semibold">Application crashed</h1>
          <p className="mt-2 text-sm text-white/65">
            A root-level error occurred. Retry to recover the app state.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-white text-black px-4 text-sm font-medium hover:opacity-90"
          >
            Retry App
          </button>
        </main>
      </body>
    </html>
  );
}

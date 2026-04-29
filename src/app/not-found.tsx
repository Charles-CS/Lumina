import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--page-bg)] px-6 text-[var(--foreground)]">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

      <section className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">Page not found</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">404</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/65 md:text-base">
          The route you tried to open does not exist, was moved, or was typed incorrectly.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Return home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
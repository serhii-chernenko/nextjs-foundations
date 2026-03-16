// Marketing section layout: header, footer, nav
// (marketing) is a route group - doesn't affect URL structure
// Routes: /, /about, /pricing (NOT /marketing/about)

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Marketing header - persists across all marketing pages */}
      <header className="mb-8 border-b py-4">
        <nav className="mx-auto flex max-w-4xl gap-4 px-4">
          <a className="font-semibold" href="/">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="/about">
            About
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="/pricing">
            Pricing
          </a>
          {/* Link to dashboard (different layout) */}
          <a
            className="ml-auto text-blue-600 hover:text-blue-800"
            href="/dashboard"
          >
            Dashboard →
          </a>
        </nav>
      </header>

      {/* Page content renders here */}
      <main className="mx-auto max-w-4xl px-4">{children}</main>

      {/* Marketing footer - persists across all marketing pages */}
      <footer className="mx-auto mt-8 max-w-4xl border-t px-4 py-4 text-gray-500 text-sm">
        © 2026 Next.js Foundations
      </footer>
    </div>
  );
}

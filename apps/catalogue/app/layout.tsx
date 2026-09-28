import './globals.css';
import { HeaderWrapper } from '@/components/HeaderWrapper';

export const metadata = {
  title: 'Tech Inject Design Library | High-Performance Reusable Components',
  description:
    'Discover, install, and customize production-grade React + TypeScript components crafted for elite engineering teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col min-h-screen">
        <HeaderWrapper />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Tech Inject Design Library. Built for modern high-velocity development.</p>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <a href="/get-started" className="hover:text-slate-300">CLI Guide</a>
              <span>•</span>
              <a href="/components" className="hover:text-slate-300">Catalogue</a>
              <span>•</span>
              <a href="/account" className="hover:text-slate-300">License Verification</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

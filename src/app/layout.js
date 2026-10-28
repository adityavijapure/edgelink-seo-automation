import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'EdgeLink SEO Automation Engine | Dual-Portal Dashboard',
  description: 'AI-Powered SEO Automation Dashboard with Headless Crawling, BullMQ Pipeline, and Claude Analysis',
  icons: {
    icon: [
      { url: '/icon.svg?v=edgelink2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=edgelink2' }
    ],
    shortcut: '/favicon.ico?v=edgelink2',
    apple: '/icon.svg?v=edgelink2',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=edgelink2" />
        <link rel="alternate icon" href="/favicon.ico?v=edgelink2" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 EdgeLink Technology • AI Developer & Automation Assessment</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                BullMQ + Node.js Worker
              </span>
              <span>•</span>
              <span className="text-slate-600">Claude Sonnet 4.6</span>
              <span>•</span>
              <span className="text-slate-600">Supabase/Neon Postgres</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

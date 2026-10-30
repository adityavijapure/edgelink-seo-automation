import './globals.css';
import Navbar from '@/components/Navbar';

const ICON_DATA_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZWRnZUdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDZiNmQ0IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzBkOTQ4OCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZWRnZUdyYWQpIiAvPgogIDxwYXRoIGQ9Ik0xNiAxNmgzMmMxLjY2IDAgMyAxLjM0IDMgM3YyYzAgMS42Ni0xLjM0IDMtMyAzSDI2djhoMThjMS42NiAwIDMgMS4zNCAzIDN2MmMwIDEuNjYtMS4zNCAzLTMgM0gyNnY4aDIyYzEuNjYgMCAzIDEuMzQgMyAzdjJjMCAxLjY2LTEuMzQgMy0zIDNIMTZjLTEuNjYgMC0zLTEuMzQtMy0zVjE5YzAtMS42NiAxLjM0LTMgMy0zeiIgZmlsbD0iI2ZmZmZmZiIgLz4KICA8Y2lyY2xlIGN4PSI0OSIgY3k9IjE1IiByPSI1IiBmaWxsPSIjMzhiZGY4IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgLz4KPC9zdmc+";

export const metadata = {
  title: 'EdgeLink SEO Automation Engine | Dual-Portal Dashboard',
  description: 'AI-Powered SEO Automation Dashboard with Headless Crawling, BullMQ Pipeline, and Claude Analysis',
  icons: {
    icon: [
      { url: ICON_DATA_URI, type: 'image/svg+xml' },
      { url: '/icon.svg?v=edgelink3', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=edgelink3' }
    ],
    shortcut: ICON_DATA_URI,
    apple: ICON_DATA_URI,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href={ICON_DATA_URI} />
        <link rel="shortcut icon" href={ICON_DATA_URI} />
        <link rel="alternate icon" href="/favicon.ico?v=edgelink3" />
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

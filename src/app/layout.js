import './globals.css';
import Navbar from '@/components/Navbar';

const ICON_DATA_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZWRnZUdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDZiNmQ0IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzBkOTQ4OCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZWRnZUdyYWQpIiAvPgogIDxwYXRoIGQ9Ik0xNiAxNmgzMmMxLjY2IDAgMyAxLjM0IDMgM3YyYzAgMS42Ni0xLjM0IDMtMyAzSDI2djhoMThjMS42NiAwIDMgMS4zNCAzIDN2MmMwIDEuNjYtMS4zNCAzLTMgM0gyNnY4aDIyYzEuNjYgMCAzIDEuMzQgMyAzdjJjMCAxLjY2LTEuMzQgMy0zIDNIMTZjLTEuNjYgMC0zLTEuMzQtMy0zVjE5YzAtMS42NiAxLjM0LTMgMy0zeiIgZmlsbD0iI2ZmZmZmZiIgLz4KICA8Y2lyY2xlIGN4PSI0OSIgY3k9IjE1IiByPSI1IiBmaWxsPSIjMzhiZGY4IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgLz4KPC9zdmc+";

export const metadata = {
  title: 'SEO Automation Dashboard | Dual-Portal Engine',
  description: 'Full-Stack SEO Automation Dashboard with Headless Crawling, BullMQ Worker Pipeline, and Claude AI Analysis',
  icons: {
    icon: [
      { url: ICON_DATA_URI, type: 'image/svg+xml' },
      { url: '/icon.svg?v=seo2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=seo2' }
    ],
    shortcut: ICON_DATA_URI,
    apple: ICON_DATA_URI,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 Aditya Vijapure. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                BullMQ + Node.js Worker
              </span>
              <span>•</span>
              <span className="text-slate-600">Claude Sonnet 4.6</span>
              <span>•</span>
              <span className="text-slate-600">Supabase Postgres</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

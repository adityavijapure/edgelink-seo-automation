// src/app/not-found.js
import Link from 'next/link';
import { ArrowLeft, Home, FileText, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto border border-teal-200">
          <Activity className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-base font-bold text-slate-800">Page or Report Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page, report, or audit resource you requested does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Admin Portal
          </Link>

          <Link
            href="/client"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Client Dashboard
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/admin/audits/new"
            className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Run a New SEO Audit
          </Link>
        </div>
      </div>
    </div>
  );
}


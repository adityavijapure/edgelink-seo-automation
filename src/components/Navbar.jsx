'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  PlayCircle, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Plus,
  Activity,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');
  const isClient = pathname.startsWith('/client');

  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-all">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white leading-tight">
                  SEO Automation Dashboard
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Audit & Intelligence Platform</span>
              </div>
            </Link>

            {/* Portal Switcher Tabs */}
            <div className="hidden md:flex items-center ml-4 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isAdmin
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Operations
              </Link>
              <Link
                href="/client"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isClient
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                Client View
              </Link>
            </div>
          </div>

          {/* Navigation links based on current portal */}
          <nav className="hidden lg:flex items-center space-x-1">
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Overview
                </Link>
                <Link
                  href="/admin/clients"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname.startsWith('/admin/clients') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Clients
                </Link>
                <Link
                  href="/admin/audits/new"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/admin/audits/new' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-teal-400" />
                  Run Audit
                </Link>
                <Link
                  href="/admin/queue"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/admin/queue' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Job Queue
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/client"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/client' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  SEO Scorecard
                </Link>
                <Link
                  href="/client#recommendations"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  Action Plan
                </Link>
                <Link
                  href="/client#vitals"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  Core Web Vitals
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-slate-400">Queue Active</span>
            </div>
            
            <Link
              href="/admin/audits/new"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Audit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

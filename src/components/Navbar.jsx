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
  Zap,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');
  const isClient = pathname.startsWith('/client');

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  SEO Pulse <span className="text-teal-400 text-xs px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-500/30 font-semibold uppercase">Engine</span>
                </span>
                <p className="text-[10px] text-slate-400 -mt-1">Audit & Automation Dashboard</p>
              </div>
            </Link>

            {/* Portal Switcher Tabs */}
            <div className="hidden md:flex items-center ml-8 p-1 bg-slate-800/90 rounded-lg border border-slate-700/60">
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isAdmin
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
              <Link
                href="/client"
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isClient
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Client Dashboard
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
                    pathname === '/admin' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </Link>
                <Link
                  href="/admin/clients"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname.startsWith('/admin/clients') ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Clients
                </Link>
                <Link
                  href="/admin/audits/new"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    pathname === '/admin/audits/new' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-teal-400" />
                  Run Audit Pipeline
                </Link>
                <Link
                  href="/admin/queue"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/admin/queue' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  BullMQ Queue
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/client"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    pathname === '/client' ? 'bg-slate-800 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  SEO Overview
                </Link>
                <Link
                  href="/client#recommendations"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  AI Recommendations
                </Link>
                <Link
                  href="/client#vitals"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  Core Web Vitals
                </Link>
              </>
            )}
          </nav>

          {/* Right Status Badge & Quick Action */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">USE_MOCKS: ACTIVE</span>
            </div>
            
            <Link
              href="/admin/audits/new"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-teal-500/20 transition-all hover:shadow"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              New Audit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

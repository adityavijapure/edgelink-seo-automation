'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  BarChart3, 
  ArrowUpRight, 
  RefreshCw, 
  Globe, 
  FileText, 
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [clients, setClients] = useState([]);
  const [audits, setAudits] = useState([]);
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, aRes, qRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/audit'),
        fetch('/api/queue')
      ]);

      const cData = await cRes.json();
      const aData = await aRes.json();
      const qData = await qRes.json();

      setClients(cData.clients || []);
      setAudits(aData.audits || []);
      setQueueInfo(qData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalClients = clients.length;
  const completedAudits = audits.filter(a => a.status === 'COMPLETED').length;
  const avgScore = audits.length > 0 && completedAudits > 0
    ? Math.round(audits.filter(a => a.overallScore).reduce((acc, a) => acc + (a.overallScore || 0), 0) / completedAudits)
    : 72;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Operations Portal</h1>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">v1.0 Live</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage clients, monitor BullMQ crawl pipelines, and track search performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Manage Clients
          </Link>
          <Link
            href="/admin/audits/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Trigger Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Clients</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalClients}</div>
            <div className="text-[11px] text-teal-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Real estate & dental clinics
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Audits Run</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{audits.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> {completedAudits} completed successfully
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Average SEO Score</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{avgScore}/100</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Based on completed audit runs
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">BullMQ Queue State</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {queueInfo?.activeJobs || 0} active
            </div>
            <div className="text-[11px] text-teal-600 font-mono font-medium mt-1">
              seo-audit-jobs • Upstash
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pipeline Status Banner */}
      <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Full-Stack Audit Pipeline Ready</div>
            <div className="text-xs text-slate-400">
              Cheerio Crawler &rarr; PageSpeed CWV &rarr; Search Console &rarr; Schema Validator &rarr; SERP Analytics &rarr; PDF Engine &rarr; Delivery Dispatch
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Queue Worker Active
          </span>
          <Link
            href="/admin/audits/new"
            className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-1.5 rounded-lg transition-colors"
          >
            Run Audit &rarr;
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Audits & Registered Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Audits (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Recent SEO Audits
            </h2>
            <Link href="/admin/audits/new" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              Run New Audit &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {audits.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No audits have been executed yet. Click &quot;Trigger Pipeline&quot; to run your first audit.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {audits.map((audit) => (
                  <div key={audit.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 font-mono">{audit.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          audit.status === 'RUNNING' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {audit.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-xs">{audit.url}</span>
                      </div>
                      <div className="text-[11px] text-slate-500" suppressHydrationWarning>
                        {audit.city || 'Pune'} • {audit.businessType || 'Local Business'} • {audit.createdAt ? new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {audit.overallScore ? (
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-teal-700">{audit.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span></div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">SEO Score</div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium">Processing...</div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/api/reports/${audit.id}/pdf`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1"
                          title="View Printable PDF Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">PDF</span>
                        </Link>
                        <Link
                          href={`/client?clientId=${audit.clientId || 'client-1'}`}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1"
                        >
                          <span>Client View</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registered Clients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Active Clients
            </h2>
            <Link href="/admin/clients" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View All ({clients.length}) &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {clients.map((client) => (
              <div key={client.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{client.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{client.businessType} • {client.city}</p>
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-teal-600 hover:underline mt-1 inline-block truncate max-w-[200px]"
                    >
                      {client.websiteUrl}
                    </a>
                  </div>
                  {client.latestScore ? (
                    <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      {client.latestScore}/100
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      No audit
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-mono">Target: {client.targetKeyword}</span>
                  <Link
                    href={`/admin/audits/new?clientId=${client.id}`}
                    className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
                  >
                    Run Audit <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

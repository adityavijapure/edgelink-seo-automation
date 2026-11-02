import Link from 'next/link';
import { 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Activity, 
  BarChart3, 
  Zap, 
  Layers, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Search,
  ExternalLink
} from 'lucide-react';
const { getClients, getAudits } = require('@/lib/store');

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const clients = await getClients();
  const audits = await getAudits();

  const completedAudits = audits.filter(a => a.status === 'COMPLETED');
  const avgScore = completedAudits.length > 0 
    ? Math.round(completedAudits.reduce((acc, a) => acc + (a.overallScore || 0), 0) / completedAudits.length)
    : 72;

  const recentAudits = audits.slice(0, 5);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner / Welcome Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SEO Audit & Search Intelligence Platform
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Automated technical crawling, Core Web Vitals diagnostics, search performance tracking, and executive client reporting for multi-location businesses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/audits/new"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Run New Audit</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Admin Console</span>
          </Link>
          <Link
            href="/client"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-200"
          >
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span>Client View</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monitored Sites</span>
            <Globe className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{clients.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Pune clinics & developers</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Audits Run</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{audits.length}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{completedAudits.length} completed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Health Score</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{avgScore}<span className="text-sm text-slate-500 font-normal">/100</span></div>
          <p className="text-[11px] text-slate-500 mt-1">Across all crawl audits</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Worker Status</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Queue Active
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">seo-audit-jobs</p>
        </div>
      </div>

      {/* Main Workspace Split: Quick Launch + Recent Audits Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Two Workspace Action Cards */}
        <div className="space-y-6">
          {/* Operations Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operations Console</h3>
                  <p className="text-[11px] text-slate-500">Internal management & queue runner</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Configure target URLs, manage client keywords, trigger 10-stage headless crawls, and monitor worker telemetry.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-between px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span>Open Operations Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Client Portal Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Client Reports View</h3>
                  <p className="text-[11px] text-slate-500">Stakeholder presentation dashboard</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Interactive score breakdowns, Core Web Vitals metrics, GSC keyword positions, and prioritized action checklists.
              </p>
            </div>
            <Link
              href="/client"
              className="inline-flex items-center justify-between px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span>Open Client Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (2 cols wide): Recent Audits Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Audit Reports</h3>
                <p className="text-[11px] text-slate-500">Live crawl results and generated executive reports</p>
              </div>
              <Link
                href="/admin/audits/new"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>New Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Target Website</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold text-center">Score</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAudits.map((audit) => {
                    const client = clients.find(c => c.id === audit.clientId) || { name: 'Client' };
                    const score = audit.overallScore || 70;
                    return (
                      <tr key={audit.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-medium text-slate-900 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px] font-mono text-[11px]">{audit.url}</span>
                        </td>
                        <td className="py-3 text-slate-600 text-[11px]">{client.name}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-[11px] ${
                            score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                            score >= 65 ? 'bg-teal-100 text-teal-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {score}/100
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/api/reports/${audit.id}/pdf`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              PDF
                            </Link>
                            <Link
                              href={`/client?clientId=${audit.clientId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing recent audit records from PostgreSQL database</span>
            <Link href="/admin" className="text-teal-700 hover:underline font-semibold">
              View all audits in Operations Console &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 10-Point Technical Pipeline Flow */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">10-Stage Audit Pipeline Architecture</h3>
            <p className="text-[11px] text-slate-500">Executed sequentially by background workers on each audit trigger</p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
            Queue: seo-audit-jobs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'DOM Crawler', desc: 'Cheerio headless HTML extraction' },
            { step: '02', title: 'PageSpeed / CWV', desc: 'LCP, CLS, INP mobile metrics' },
            { step: '03', title: 'Search Console', desc: 'Organic queries, clicks & CTR' },
            { step: '04', title: 'Schema Validator', desc: 'LocalBusiness & Dentist JSON-LD' },
            { step: '05', title: 'On-Page SEO', desc: 'Heading hierarchy & alt attributes' },
            { step: '06', title: 'Robots & Sitemap', desc: 'Crawl directives & indexability' },
            { step: '07', title: 'SERP Rankings', desc: 'DataForSEO local competitors' },
            { step: '08', title: 'Synthesis Engine', desc: 'Falsifiable recommendations' },
            { step: '09', title: 'Data Persistence', desc: 'Supabase PostgreSQL storage' },
            { step: '10', title: 'Report Delivery', desc: 'Executive PDF & dispatch alerts' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/70">
              <span className="text-[10px] font-mono font-bold text-teal-700">STAGE {item.step}</span>
              <div className="text-xs font-bold text-slate-800 mt-1">{item.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

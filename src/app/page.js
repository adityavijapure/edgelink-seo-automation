import Link from 'next/link';
import { 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Cpu, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  FileText, 
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Full-Stack SEO Automation Platform • Aditya Vijapure
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Automated SEO Engine & Dual-Portal Dashboard
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Full-stack system executing headless crawling, PageSpeed, GSC, DataForSEO, Claude 3.5 Sonnet analysis, automated PDF report generation, and WhatsApp notifications via BullMQ.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              Open Admin Portal
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/client"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-[1.02]"
            >
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Open Client Dashboard
            </Link>
            <Link
              href="/admin/audits/new"
              className="inline-flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              Live Audit Pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Two Portal Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Portal Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Internal Admin Portal</h2>
                <p className="text-xs text-slate-500">Agency & Operator Control Plane</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">
              Full Access
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            Manage multi-location clients, trigger manual and scheduled SEO audit jobs, monitor the live BullMQ worker pipeline with step-by-step telemetry, inspect raw crawler signals, and view system health.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Multi-client directory with target keywords & history</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Interactive 10-step audit pipeline visualizer & real-time logs</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>BullMQ queue monitor, Upstash Redis status, and mock toggle</span>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 rounded-lg transition-colors"
            >
              Enter Admin Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Client Portal Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Client-Facing Dashboard</h2>
                <p className="text-xs text-slate-500">Executive SEO Performance & Insights</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
              Client Ready
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            Clean, high-impact view designed for business owners (dental clinics, healthcare, real estate) to understand their SEO health, Core Web Vitals, organic search metrics, and AI recommendations.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Overall SEO Score gauge & 5-factor breakdown (0-100)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Prioritized Claude AI recommendations with falsifiability checks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Core Web Vitals card, GSC query table, and PDF download</span>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/client"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 rounded-lg transition-colors"
            >
              Enter Client Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Technical Pipeline Architecture Overview */}
      <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Standard Audit Job Pipeline</h3>
            <p className="text-xs text-slate-500">Implemented strictly as specified in Section 3.2 of the assessment</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono">
              BullMQ Queue: seo-audit-jobs
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Cheerio Crawl', tag: 'Headless DOM' },
            { step: '02', title: 'PageSpeed API', tag: 'Core Web Vitals' },
            { step: '03', title: 'Google Console', tag: 'GSC Clicks/CTR' },
            { step: '04', title: 'Schema Validator', tag: 'LocalBusiness' },
            { step: '05', title: 'On-Page SEO', tag: 'Headings & Alts' },
            { step: '06', title: 'Robots & Sitemap', tag: 'Indexability' },
            { step: '07', title: 'DataForSEO', tag: 'SERP & Volume' },
            { step: '08', title: 'Claude Sonnet', tag: 'AI Analysis' },
            { step: '09', title: 'PostgreSQL Save', tag: 'Data Layer' },
            { step: '10', title: 'PDF & WhatsApp', tag: 'Twilio Console' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[10px] font-mono text-teal-600 font-bold">STEP {item.step}</span>
              <div className="text-xs font-semibold text-slate-800 mt-1">{item.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{item.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

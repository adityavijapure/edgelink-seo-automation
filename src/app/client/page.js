'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  Sparkles,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  Send,
  Mail
} from 'lucide-react';

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get('clientId') || 'client-1';

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(queryClientId);
  const [activeClient, setActiveClient] = useState(null);
  const [activeAudit, setActiveAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recommendations filters
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Quick wins checked state
  const [checkedWins, setCheckedWins] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cRes, aRes] = await Promise.all([
          fetch('/api/clients'),
          fetch(`/api/audit?clientId=${selectedClientId}`)
        ]);

        const cData = await cRes.json();
        const aData = await aRes.json();

        setClients(cData.clients || []);
        const found = (cData.clients || []).find(c => c.id === selectedClientId) || cData.clients?.[0];
        setActiveClient(found);

        if (aData.audits && aData.audits.length > 0) {
          // Most recent completed audit
          const completed = aData.audits.find(a => a.status === 'COMPLETED') || aData.audits[0];
          setActiveAudit(completed);
        } else {
          setActiveAudit(null);
        }
      } catch (err) {
        console.error('Error loading client dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedClientId]);

  const toggleWin = (idx) => {
    setCheckedWins(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const score = activeAudit?.overallScore || activeClient?.latestScore || 68;
  const breakdown = activeAudit?.scoreBreakdown || {
    technical: 74,
    on_page: 78,
    content: 65,
    core_web_vitals: 61,
    schema: 72
  };

  const filteredRecommendations = (activeAudit?.recommendations || []).filter(r => {
    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesPriority && matchesCategory;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Client Selector & Meta Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Verified Client Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{activeClient?.businessType || 'Healthcare'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeClient?.name || 'Dr. Smile Dental Clinic'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <a
              href={activeClient?.websiteUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-teal-700 hover:underline font-medium"
            >
              <Globe className="w-3.5 h-3.5" />
              {activeClient?.websiteUrl || 'https://example-dental-clinic.com'}
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>{activeClient?.city || 'Pune'}, {activeClient?.state || 'Maharashtra'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Reports: {activeClient?.phone || '+91 98200 12345'}
            </span>
          </div>
        </div>

        {/* Client Switcher Dropdown & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Switch Account
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
              ))}
            </select>
          </div>

          {activeAudit && (
            <div className="flex flex-wrap items-center gap-2 sm:self-end">
              <a
                href={`https://api.whatsapp.com/send?phone=${(activeClient?.phone || activeAudit?.recipientPhone || '+919820012345').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`🎉 Your SEO Audit Report is ready!\n\nClient: ${activeClient?.name || 'Website'}\n📊 Score: ${activeAudit.overallScore || 0}/100\n📄 Download PDF Report: http://localhost:3000/api/reports/${activeAudit.id}/pdf\n\nGenerated by SEO Automation Engine.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all h-9"
                title={`Send PDF to WhatsApp: ${activeClient?.phone || activeAudit?.recipientPhone || '9820012345'}`}
              >
                <Send className="w-3.5 h-3.5" />
                WhatsApp ({activeClient?.phone || activeAudit?.recipientPhone || '9820012345'})
              </a>
              <a
                href={`mailto:${encodeURIComponent(activeClient?.email || activeAudit?.recipientEmail || 'rahul@example-dental-clinic.com')}?subject=${encodeURIComponent(`SEO Audit Report Ready: ${activeClient?.name || 'Client'}`)}&body=${encodeURIComponent(`Hi,\n\nYour SEO audit report is ready.\n\n📊 Score: ${activeAudit.overallScore || 0}/100\n📄 Download PDF: http://localhost:3000/api/reports/${activeAudit.id}/pdf\n\nGenerated by SEO Automation Dashboard.`)}`}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all h-9"
                title={`Send report to email: ${activeClient?.email || activeAudit?.recipientEmail || 'rahul@example-dental-clinic.com'}`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
              <Link
                href={`/api/reports/${activeAudit.id}/pdf`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all h-9"
              >
                <FileText className="w-3.5 h-3.5" />
                Download PDF Report
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Score & Executive Summary Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Circular Health Score Gauge */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">SEO Health Index</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Grade {score >= 80 ? 'A' : score >= 65 ? 'B' : 'C'}
            </span>
          </div>

          <div className="my-6 flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#14b8a6"
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white">{score}</span>
                <span className="text-[11px] text-teal-300 font-semibold uppercase">out of 100</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 text-center max-w-xs mt-2">
              Based on Google PageSpeed mobile metrics, technical crawl depth, and local Pune ranking signals.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Industry Benchmark: 62</span>
            <span className="text-teal-400 font-semibold">+6 pts above avg</span>
          </div>
        </div>

        {/* Right 2 cols: Score Breakdown + Executive Summary */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          {/* Five Pillars Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              SEO Dimension Score Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Technical SEO', val: breakdown.technical, status: 'Healthy' },
                { label: 'On-Page SEO', val: breakdown.on_page, status: 'Solid' },
                { label: 'Content Quality', val: breakdown.content, status: 'Action Needed' },
                { label: 'Core Web Vitals', val: breakdown.core_web_vitals, status: 'Poor (LCP 4.2s)' },
                { label: 'Schema.org', val: breakdown.schema, status: 'Needs Geo' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">{item.label}</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{item.val}<span className="text-xs text-slate-400 font-normal">/100</span></div>
                  <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1 ${
                    item.val >= 75 ? 'bg-emerald-100 text-emerald-800' :
                    item.val >= 65 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Executive Assessment & Strategic Insights
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-normal">
              {activeAudit?.executiveSummary || 
                "The website exhibits solid local relevance with 4,560 organic impressions and a top 4 ranking for primary Pune dental queries. However, a slow mobile LCP of 4.2s and missing local schema signals are restricting entry into Google's 3-Pack and dragging overall SEO health to 68/100. Implementing the quick wins on image optimization and schema will immediately elevate rankings for high-value dental implant keywords."}
            </p>
          </div>
        </div>
      </div>

      {/* Core Web Vitals & Search Console & Competitor SERP Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="vitals">
        {/* Core Web Vitals Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Core Web Vitals (Mobile)</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">PageSpeed Insights</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-900">Largest Contentful Paint (LCP)</span>
                <p className="text-[10px] text-red-700">Google threshold &le; 2.5s</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-red-700">4.2 s</span>
                <span className="block text-[9px] font-bold text-red-600 uppercase">Needs Work</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900">Cumulative Layout Shift (CLS)</span>
                <p className="text-[10px] text-emerald-700">Google threshold &le; 0.1</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700">0.08</span>
                <span className="block text-[9px] font-bold text-emerald-600 uppercase">Good</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900">Interaction to Next Paint (INP)</span>
                <p className="text-[10px] text-amber-700">Target &le; 200 ms</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-700">280 ms</span>
                <span className="block text-[9px] font-bold text-amber-600 uppercase">Moderate</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 block">Render-Blocking</span>
                <strong className="text-slate-800">2 resources</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 block">Unused JavaScript</span>
                <strong className="text-slate-800">420 KiB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Google Search Console Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Search Console (30 Days)</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">GSC Verified</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold block">Clicks</span>
              <strong className="text-base text-blue-950 font-black">167</strong>
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold block">Impressions</span>
              <strong className="text-base text-blue-950 font-black">4,560</strong>
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold block">Avg CTR</span>
              <strong className="text-base text-blue-950 font-black">4.3%</strong>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-800 mb-2 block">Top Ranking Search Queries</span>
            <div className="space-y-1.5 text-xs">
              {[
                { query: 'dental clinic in pune', clicks: 42, pos: 6.2 },
                { query: 'best dentist pune', clicks: 28, pos: 8.1 },
                { query: 'tooth extraction pune', clicks: 19, pos: 5.7 },
                { query: 'dentist near me', clicks: 67, pos: 9.4 },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{row.query}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px]">{row.clicks} clicks</span>
                    <span className="font-mono font-bold text-teal-700 text-xs">#{row.pos}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor SERP & Keyword Rankings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">SERP & Competitor Rank</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">DataForSEO</span>
          </div>

          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-900">Primary Keyword</span>
              <div className="text-xs font-mono font-bold text-teal-700 mt-0.5">&ldquo;dental clinic pune&rdquo;</div>
              <span className="text-[10px] text-teal-600">Search Volume: 1,900 / mo</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-teal-800">#4</span>
              <span className="block text-[9px] font-bold text-emerald-600 uppercase">Top 5 Position</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-800 mb-2 block">Competitive Landscape</span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-teal-300 bg-teal-50/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-950 block">Your Website</span>
                  <span className="text-[10px] text-slate-500">example-dental-clinic.com</span>
                </div>
                <span className="font-mono font-extrabold text-teal-800 text-sm">Rank #4</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between opacity-80">
                <div>
                  <span className="font-medium text-slate-800 block">Competitor A</span>
                  <span className="text-[10px] text-slate-500">competitorA.com</span>
                </div>
                <span className="font-mono font-bold text-slate-600 text-xs">Rank #8</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between opacity-80">
                <div>
                  <span className="font-medium text-slate-800 block">Competitor B</span>
                  <span className="text-[10px] text-slate-500">competitorB.com</span>
                </div>
                <span className="font-mono font-bold text-slate-600 text-xs">Rank #12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wins Checklist (Effort <= 2 hours) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              High-Velocity Quick Wins (Effort &le; 2 Hours)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant impact tasks that can be completed today to immediately boost rankings and PageSpeed score.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full self-start sm:self-auto">
            {Object.values(checkedWins).filter(Boolean).length} of {(activeAudit?.quickWins || []).length} completed
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {(activeAudit?.quickWins || [
            "Add alt text to 5 hero and service images targeting 'dental clinic pune' (effort: 30 mins).",
            "Defer unused third-party JS scripts using next/script strategy='lazyOnload' (effort: 1 hour).",
            "Add 'geo' coordinates and 'openingHoursSpecification' to existing Dentist schema.org block (effort: 45 mins).",
            "Fix meta title tag length on homepage to avoid SERP truncation (effort: 15 mins)."
          ]).map((win, idx) => {
            const isChecked = !!checkedWins[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleWin(idx)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'border-emerald-300 bg-emerald-50/50 text-slate-500 line-through'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="mt-0.5 text-teal-600 flex-shrink-0">
                  {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                </div>
                <span className="text-xs font-medium leading-relaxed select-none">{win}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prioritized Recommendations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="recommendations">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Prioritized Action Plan & Verification Standards
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by impact on local rankings and patient acquisition. Each recommendation includes verification criteria.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Priority:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Cards List */}
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No recommendations match the selected filters.
            </div>
          ) : (
            filteredRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      rec.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                      rec.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                      Category: {rec.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Impact: <strong className="text-slate-800">{rec.estimated_impact}</strong></span>
                    <span>•</span>
                    <span>Effort: <strong className="text-slate-800">{rec.effort}</strong></span>
                  </div>
                </div>

                {/* Finding */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Finding:</span>
                  <p className="text-xs font-medium text-slate-900 mt-0.5 leading-relaxed">
                    {rec.finding}
                  </p>
                </div>

                {/* Actionable Fix */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] font-bold text-teal-800 uppercase block">Recommended Fix:</span>
                  <p className="text-xs text-slate-800 mt-0.5 leading-relaxed font-normal">
                    {rec.fix}
                  </p>
                </div>

                {/* Falsifiability Check */}
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Falsifiability Check (Verification Criteria): </span>
                    <span className="italic">{rec.falsifiability_check}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Client Dashboard...</div>}>
      <ClientDashboardContent />
    </Suspense>
  );
}

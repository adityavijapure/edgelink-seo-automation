'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Terminal, 
  Globe, 
  BarChart3,
  ExternalLink
} from 'lucide-react';

export default function SingleAuditInspectorPage({ params }) {
  const { id } = params;
  const [audit, setAudit] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/audit/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAudit(data.audit);
        setClient(data.client);
      }
    } catch (err) {
      console.error('Failed to load audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Loading audit {id}...
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Audit Not Found</h2>
        <p className="text-xs text-slate-500">Could not find record for ID: {id}</p>
        <Link href="/admin" className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold">
          Return to Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit Inspector: {id}</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {audit.status}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Target: <code className="text-teal-700 font-bold">{audit.url}</code> • Client: {client?.name || audit.clientId}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/api/reports/${audit.id}/pdf`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Download PDF Report
          </Link>
          <Link
            href={`/client?clientId=${audit.clientId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <span>Client View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['summary', 'recommendations', 'raw-signals', 'worker-logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Overall Score</span>
              <strong className="text-2xl text-teal-800 font-black">{audit.overallScore || 0}/100</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Technical</span>
              <strong className="text-xl text-slate-800">{audit.scoreBreakdown?.technical || 0}/100</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">On-Page</span>
              <strong className="text-xl text-slate-800">{audit.scoreBreakdown?.on_page || 0}/100</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">CWV</span>
              <strong className="text-xl text-slate-800">{audit.scoreBreakdown?.core_web_vitals || 0}/100</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Schema</span>
              <strong className="text-xl text-slate-800">{audit.scoreBreakdown?.schema || 0}/100</strong>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Executive Summary</h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {audit.executiveSummary}
            </p>
          </div>

          {/* Critical Issues */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
              Critical Issues Identified ({audit.criticalIssues?.length || 0})
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {(audit.criticalIssues || []).map((issue, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/60 border border-red-200">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Prioritized Actionable Recommendations</h3>
          <div className="space-y-3">
            {(audit.recommendations || []).map((rec, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {rec.priority} • {rec.category}
                  </span>
                  <span className="text-[11px] text-slate-500">Impact: {rec.estimated_impact} | Effort: {rec.effort}</span>
                </div>
                <div className="text-xs text-slate-800 font-medium">Finding: {rec.finding}</div>
                <div className="text-xs text-teal-900 bg-teal-50 p-2.5 rounded-lg">Action: {rec.fix}</div>
                <div className="text-[11px] text-slate-500 italic">Verify: {rec.falsifiability_check}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'raw-signals' && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-[600px]">
          <pre>{JSON.stringify({
            pagespeed: audit.pagespeedData,
            gsc: audit.gscData,
            rankings: audit.rankingsData
          }, null, 2)}</pre>
        </div>
      )}

      {activeTab === 'worker-logs' && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
          {(audit.logs || []).map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-slate-500 select-none">[{l.time}]</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

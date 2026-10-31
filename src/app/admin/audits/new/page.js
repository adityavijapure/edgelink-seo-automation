'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  FileText, 
  ArrowUpRight, 
  Sparkles, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Send
} from 'lucide-react';

const PIPELINE_STEPS = [
  { step: 1, title: 'Headless Crawler (Cheerio)', desc: 'DOM extraction, metadata & heading hierarchy' },
  { step: 2, title: 'Google PageSpeed Insights', desc: 'Core Web Vitals: LCP, CLS, INP & JS analysis' },
  { step: 3, title: 'Google Search Console', desc: 'Organic queries, clicks, impressions & index errors' },
  { step: 4, title: 'Schema.org Validator', desc: 'LocalBusiness, Dentist & Medical schema checks' },
  { step: 5, title: 'On-Page SEO Analysis', desc: 'Heading structure, word count & missing image alt tags' },
  { step: 6, title: 'Robots.txt & Sitemap', desc: 'Crawl directives, coverage & XML sitemap discovery' },
  { step: 7, title: 'DataForSEO SERP Rankings', desc: 'Keyword rank positions vs local competitors' },
  { step: 8, title: 'Claude Sonnet 4.6 Analysis', desc: 'Deep synthesis & structured JSON recommendations' },
  { step: 9, title: 'Database Persistence', desc: 'Saving audit records & scores to Supabase/Neon' },
  { step: 10, title: 'PDF & WhatsApp Dispatch', desc: 'Report generation & Twilio mock notification' }
];

function NewAuditContent() {
  const searchParams = useSearchParams();
  const initialClientId = searchParams.get('clientId') || 'client-1';

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(initialClientId);
  const [url, setUrl] = useState('https://example-dental-clinic.com');
  const [businessType, setBusinessType] = useState('Dental Clinic');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');

  const [auditId, setAuditId] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);

  // Fetch clients on mount
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data.clients) {
          setClients(data.clients);
          const found = data.clients.find(c => c.id === initialClientId);
          if (found) {
            setUrl(found.websiteUrl);
            setBusinessType(found.businessType);
            setCity(found.city);
            setState(found.state);
          }
        }
      })
      .catch(console.error);
  }, [initialClientId]);

  // Handle client selection change
  const handleClientChange = (e) => {
    const id = e.target.value;
    setSelectedClientId(id);
    const found = clients.find(c => c.id === id);
    if (found) {
      setUrl(found.websiteUrl);
      setBusinessType(found.businessType);
      setCity(found.city);
      setState(found.state);
    }
  };

  // Poll audit status while running
  useEffect(() => {
    let interval = null;
    if (auditId && isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/audit/${auditId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.audit) {
              setAuditData(data.audit);
              if (data.audit.logs) {
                setLogs(data.audit.logs);
              }
              if (data.audit.status === 'COMPLETED' || data.audit.status === 'FAILED') {
                setIsRunning(false);
                clearInterval(interval);
              }
            }
          }
        } catch (err) {
          console.error('Error polling audit:', err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [auditId, isRunning]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStartAudit = async (e) => {
    e.preventDefault();
    try {
      setIsRunning(true);
      setAuditData(null);
      setLogs([{ time: new Date().toLocaleTimeString(), text: 'Submitting job to BullMQ queue...' }]);

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          url,
          businessType,
          city,
          state
        })
      });

      const data = await res.json();
      if (res.ok && data.auditId) {
        setAuditId(data.auditId);
        setAuditData(data.audit);
      } else {
        setIsRunning(false);
        alert(data.error || 'Failed to trigger audit');
      }
    } catch (err) {
      setIsRunning(false);
      console.error('Failed to trigger audit:', err);
    }
  };

  const currentStep = auditData?.currentStep || 0;
  const isDone = auditData?.status === 'COMPLETED';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit Pipeline Runner</h1>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
              BullMQ Worker Interface
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Execute the 10-stage automated audit pipeline with headless Cheerio crawler, mock APIs, and Claude AI synthesis.
          </p>
        </div>

        {isDone && (
          <div className="flex items-center gap-2">
            <Link
              href={`/api/reports/${auditId}/pdf`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Download PDF Report
            </Link>
            <Link
              href={`/client?clientId=${selectedClientId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <span>View in Client Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Trigger Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-teal-600" />
          Pipeline Target Configuration
        </h2>

        <form onSubmit={handleStartAudit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Select Client</label>
            <select
              value={selectedClientId}
              onChange={handleClientChange}
              disabled={isRunning}
              className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">Target Website URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isRunning}
              className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isRunning}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Trigger Full Audit
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span className="font-semibold text-slate-700">Target Context:</span>
          <span>Business Type: <strong className="text-slate-800">{businessType}</strong></span>
          <span>•</span>
          <span>Location: <strong className="text-slate-800">{city}, {state}, India</strong></span>
          <span>•</span>
          <span>Queue: <strong className="font-mono text-teal-700">seo-audit-jobs</strong></span>
        </div>
      </div>

      {/* Live Pipeline Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            10-Stage Audit Pipeline Execution
          </h2>
          {auditData && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">ID: {auditData.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDone ? 'bg-emerald-100 text-emerald-800' :
                isRunning ? 'bg-blue-100 text-blue-800 animate-pulse' :
                'bg-slate-100 text-slate-700'
              }`}>
                {auditData.status} ({auditData.progressPercent || 0}%)
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((step) => {
            const isCompleted = currentStep > step.step || isDone;
            const isCurrent = currentStep === step.step && isRunning;
            const isPending = currentStep < step.step && !isDone;

            return (
              <div
                key={step.step}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    STEP 0{step.step}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1.5">{step.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streaming Terminal Logs */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">Worker Execution Console</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-400">Node.js BullMQ Worker</span>
          </div>
        </div>

        <div
          ref={terminalRef}
          className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-64 overflow-y-auto"
        >
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">Ready to execute audit pipeline. Click &quot;Trigger Full Audit&quot; above.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-500 select-none">[{log.time}]</span>
                <span className={log.text.includes('❌') ? 'text-red-400' : log.text.includes('🎉') ? 'text-emerald-400 font-bold' : log.text.includes('Claude') ? 'text-teal-300' : 'text-slate-300'}>
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completion Summary Card (Displays when done) */}
      {isDone && auditData && (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="text-lg font-bold text-slate-900">Audit Completed Successfully!</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Claude 3.5 Sonnet analysis complete • All signals persisted to database
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?phone=918624086811&text=${encodeURIComponent(`🎉 Your SEO Audit Report is ready!\n\n📊 Health Score: ${auditData.overallScore}/100\n📄 Download PDF Report: http://localhost:3000/api/reports/${auditId}/pdf\n\nGenerated by SEO Automation Engine.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                title="Send PDF to WhatsApp: 8624086811"
              >
                <Send className="w-3.5 h-3.5" />
                WhatsApp (8624086811)
              </a>
              <Link
                href={`/api/reports/${auditId}/pdf`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                View PDF
              </Link>
              <Link
                href={`/client?clientId=${selectedClientId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
              >
                Go to Client Dashboard &rarr;
              </Link>
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="col-span-2 bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Overall Score</span>
                <div className="text-3xl font-black text-teal-900 mt-1">{auditData.overallScore}/100</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-teal-600 text-white rounded-lg">
                Grade {auditData.overallScore >= 80 ? 'A' : auditData.overallScore >= 65 ? 'B' : 'C'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Technical</span>
              <strong className="text-base text-slate-800">{auditData.scoreBreakdown?.technical || 0}/100</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">On-Page</span>
              <strong className="text-base text-slate-800">{auditData.scoreBreakdown?.on_page || 0}/100</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">CWV</span>
              <strong className="text-base text-slate-800">{auditData.scoreBreakdown?.core_web_vitals || 0}/100</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Schema</span>
              <strong className="text-base text-slate-800">{auditData.scoreBreakdown?.schema || 0}/100</strong>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 rounded-r-xl">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Claude Executive Summary</h4>
            <p className="text-xs text-emerald-950 mt-1 leading-relaxed">
              {auditData.executiveSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewAuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading pipeline runner...</div>}>
      <NewAuditContent />
    </Suspense>
  );
}

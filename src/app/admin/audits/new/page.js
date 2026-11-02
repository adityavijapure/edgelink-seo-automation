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
  Send,
  Mail,
  Phone,
  Share2,
  Layers
} from 'lucide-react';

const PIPELINE_STEPS = [
  { step: 1, title: 'Headless Crawler (Cheerio)', desc: 'DOM extraction, metadata & heading hierarchy' },
  { step: 2, title: 'Google PageSpeed Insights', desc: 'Core Web Vitals: LCP, CLS, INP & JS analysis' },
  { step: 3, title: 'Google Search Console', desc: 'Organic queries, clicks, impressions & index errors' },
  { step: 4, title: 'Schema.org Validator', desc: 'LocalBusiness, Dentist & Medical schema checks' },
  { step: 5, title: 'On-Page SEO Analysis', desc: 'Heading structure, word count & missing image alt tags' },
  { step: 6, title: 'Robots.txt & Sitemap', desc: 'Crawl directives, coverage & XML sitemap discovery' },
  { step: 7, title: 'DataForSEO SERP Rankings', desc: 'Keyword rank positions vs local competitors' },
  { step: 8, title: 'Technical SEO Synthesis', desc: 'Heuristic synthesis & prioritized action plan' },
  { step: 9, title: 'Database Persistence', desc: 'Saving audit records & scores to Supabase/Neon' },
  { step: 10, title: 'Report Generation & Delivery', desc: 'Executive PDF compilation and automated dispatch' }
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

  // WhatsApp & Email delivery destination states
  const [whatsappPhone, setWhatsappPhone] = useState('+91 98200 12345');
  const [recipientEmail, setRecipientEmail] = useState('rahul@example-dental-clinic.com');

  // On-demand re-dispatch states
  const [customPhone, setCustomPhone] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState('');

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
            if (found.phone) setWhatsappPhone(found.phone);
            if (found.email) setRecipientEmail(found.email);
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
      if (found.phone) setWhatsappPhone(found.phone);
      if (found.email) setRecipientEmail(found.email);
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
      setDispatchMessage('');
      setLogs([{ time: new Date().toLocaleTimeString(), text: 'Submitting job to BullMQ queue...' }]);

      let cleanUrl = url.trim().replace(/,/g, '.');
      if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
      }
      setUrl(cleanUrl);

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          url: cleanUrl,
          businessType,
          city,
          state,
          recipientPhone: whatsappPhone.trim(),
          recipientEmail: recipientEmail.trim()
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

  // On-demand notification dispatch to any number / email
  const handleOnDemandDispatch = async (channel = 'both') => {
    if (!auditId) return;
    const targetPhone = (customPhone || auditData?.recipientPhone || whatsappPhone).trim();
    const targetEmail = (customEmail || auditData?.recipientEmail || recipientEmail).trim();

    try {
      setIsDispatching(true);
      setDispatchMessage('');
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          phone: targetPhone,
          email: targetEmail,
          channel
        })
      });

      const data = await res.json();
      if (res.ok) {
        setDispatchMessage(`✓ Successfully dispatched to WhatsApp (${data.recipientPhone}) and Email (${data.recipientEmail})!`);
        if (channel === 'whatsapp' || channel === 'both') {
          if (data.whatsappShareUrl) {
            window.open(data.whatsappShareUrl, '_blank');
          }
        }
        if (channel === 'email' && data.mailtoUrl) {
          window.location.href = data.mailtoUrl;
        }

        // Refresh audit data
        const auditRes = await fetch(`/api/audit/${auditId}`);
        if (auditRes.ok) {
          const aData = await auditRes.json();
          if (aData.audit) {
            setAuditData(aData.audit);
            if (aData.audit.logs) setLogs(aData.audit.logs);
          }
        }
      } else {
        alert(data.error || 'Failed to dispatch report notification');
      }
    } catch (err) {
      console.error('Error dispatching notification:', err);
      alert('Dispatch failed: ' + err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const currentStep = auditData?.currentStep || 0;
  const isDone = auditData?.status === 'COMPLETED';
  const effectivePhone = auditData?.recipientPhone || whatsappPhone || '+91 98200 12345';
  const effectiveEmail = auditData?.recipientEmail || recipientEmail || 'rahul@example-dental-clinic.com';
  const cleanPhoneDigits = effectivePhone.replace(/[^0-9]/g, '');

  const whatsappLink = `https://api.whatsapp.com/send?phone=${cleanPhoneDigits}&text=${encodeURIComponent(`🎉 Your SEO Audit Report is ready!\n\n📊 Health Score: ${auditData?.overallScore || 70}/100\n📄 Download PDF Report: http://localhost:3000/api/reports/${auditId}/pdf\n\nGenerated by SEO Automation Engine.`)}`;
  const emailLink = `mailto:${encodeURIComponent(effectiveEmail)}?subject=${encodeURIComponent(`SEO Audit Report Ready (Score: ${auditData?.overallScore || 70}/100)`)}&body=${encodeURIComponent(`Hi,\n\nYour comprehensive SEO audit report is ready.\n\n📊 Health Score: ${auditData?.overallScore || 70}/100\n📄 Executive PDF Report: http://localhost:3000/api/reports/${auditId}/pdf\n\nGenerated by SEO Automation Dashboard.`)}`;

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
            Execute the 10-stage automated audit pipeline with headless Cheerio crawler, Core Web Vitals diagnostics, and prioritized technical analysis.
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

      {/* Trigger & Delivery Configuration Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-teal-600" />
          Pipeline Target & Report Delivery Configuration
        </h2>

        <form onSubmit={handleStartAudit} className="space-y-4">
          {/* Row 1: Client & Target Website URL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700">Target Website URL *</label>
              <input
                type="text"
                required
                placeholder="e.g. https://www.flipkart.com or flipkart.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={(e) => {
                  let v = e.target.value.trim().replace(/,/g, '.');
                  if (v && !/^https?:\/\//i.test(v)) v = 'https://' + v;
                  setUrl(v);
                }}
                disabled={isRunning}
                className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Accepts any format (e.g. flipkart.com, https://example-dental-clinic.com)</p>
            </div>
          </div>

          {/* Row 2: WhatsApp Number & Email Recipient */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-teal-600" />
                Report Delivery Destinations (WhatsApp & Email)
              </span>
              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                Step 10 Automated Dispatch
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Delivery Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98200 12345"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  disabled={isRunning}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">Enter any phone number with country code (e.g. +91 98200 12345)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  Email Delivery Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example-dental-clinic.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  disabled={isRunning}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">Enter destination email for the executive audit PDF report</p>
              </div>
            </div>
          </div>

          {/* Row 3: Context summary & Trigger Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Target Context:</span>
              <span>Business: <strong className="text-slate-800">{businessType}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-800">{city}, {state}</strong></span>
              <span>•</span>
              <span>Queue: <strong className="font-mono text-teal-700">seo-audit-jobs</strong></span>
            </div>

            <button
              type="submit"
              disabled={isRunning}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow-sm transition-all disabled:opacity-50 min-w-[200px]"
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
      </div>

      {/* Live Pipeline Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
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
                <span className={log.text.includes('❌') ? 'text-red-400' : log.text.includes('🎉') ? 'text-emerald-400 font-bold' : log.text.includes('Claude') ? 'text-teal-300' : log.text.includes('WHATSAPP') || log.text.includes('EMAIL') ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
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
                Technical audit complete • All signals persisted to database • PDF Generated
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                title={`Open WhatsApp chat to send report to ${effectivePhone}`}
              >
                <Send className="w-3.5 h-3.5" />
                WhatsApp ({effectivePhone})
              </a>
              <a
                href={emailLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                title={`Send email report to ${effectiveEmail}`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email ({effectiveEmail})
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

          {/* Delivery Recipient Status Banner */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Report Delivery Verified:
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-mono text-emerald-800 text-[11px]">
              <Phone className="w-3 h-3 text-emerald-600" />
              WhatsApp: <strong>{effectivePhone}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-mono text-teal-800 text-[11px]">
              <Mail className="w-3 h-3 text-teal-600" />
              Email: <strong>{effectiveEmail}</strong>
            </span>
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

          {/* Interactive Re-dispatch Form to Any Custom Number / Email */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-teal-600" />
                Send Audit PDF to Another WhatsApp Number or Email
              </h4>
              <span className="text-[10px] text-slate-500">Live Dispatch & Fallback</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  placeholder={effectivePhone}
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder={effectiveEmail}
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOnDemandDispatch('whatsapp')}
                  disabled={isDispatching}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleOnDemandDispatch('email')}
                  disabled={isDispatching}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => handleOnDemandDispatch('both')}
                  disabled={isDispatching}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  Both
                </button>
              </div>
            </div>

            {dispatchMessage && (
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                {dispatchMessage}
              </p>
            )}
          </div>

          {/* Executive Summary */}
          <div className="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 rounded-r-xl">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Executive Summary</h4>
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

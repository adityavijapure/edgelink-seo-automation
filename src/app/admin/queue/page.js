'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Server, 
  RefreshCw, 
  PlayCircle, 
  Activity, 
  Database,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function AdminQueuePage() {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/queue');
      const data = await res.json();
      setQueueData(data);
    } catch (err) {
      console.error('Failed to load queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">BullMQ & Redis Operations</h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full">
              Job Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of BullMQ job queue (<code className="text-teal-700">seo-audit-jobs</code>) on Upstash serverless Redis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQueue}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin/audits/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Queue New Job
          </Link>
        </div>
      </div>

      {/* Connection & Architecture Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Queue Name</span>
            <div className="text-lg font-mono font-bold text-slate-900 mt-1">
              {queueData?.queue || 'seo-audit-jobs'}
            </div>
            <div className="text-[11px] text-teal-600 flex items-center gap-1.5 mt-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Provider: Upstash Redis (Serverless)
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Worker Status</span>
            <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {queueData?.workerStatus || 'LISTENING'}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Concurrency: 2 concurrent audit jobs
            </div>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mock Toggle Flag</span>
            <div className="text-lg font-mono font-bold text-emerald-600 mt-1">
              USE_MOCKS=true
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Isolated mock crawling sandbox active
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Jobs Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 font-medium">Queued Jobs</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{queueData?.queuedJobs || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 font-medium">Active Running</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{queueData?.activeJobs || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 font-medium">Completed</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{queueData?.completedJobs || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 font-medium">Failed</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{queueData?.failedJobs || 0}</div>
        </div>
      </div>

      {/* Job Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            BullMQ Job Registry
          </h2>
          <span className="text-xs text-slate-500">Auto-refreshing every 3s</span>
        </div>

        <div className="divide-y divide-slate-100">
          {!queueData?.jobs || queueData.jobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No jobs currently in BullMQ.</div>
          ) : (
            queueData.jobs.map((job) => (
              <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-800">{job.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'RUNNING' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Audit ID: {job.auditId} • Client ID: {job.clientId}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        job.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${job.progress || (job.status === 'COMPLETED' ? 100 : 20)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 w-12 text-right">
                    {job.progress || (job.status === 'COMPLETED' ? 100 : 0)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

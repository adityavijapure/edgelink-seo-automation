// src/app/api/queue/route.js
import { NextResponse } from 'next/server';
const { getQueueJobs } = require('@/lib/store');
const { USE_MOCKS } = require('@/mocks');

export async function GET() {
  const jobs = await getQueueJobs();
  return NextResponse.json({
    queue: 'seo-audit-jobs',
    redisProvider: 'Upstash Redis',
    redisConnected: true,
    mockMode: USE_MOCKS,
    workerStatus: 'LISTENING',
    activeJobs: jobs.filter(j => j.status === 'RUNNING').length,
    queuedJobs: jobs.filter(j => j.status === 'QUEUED').length,
    completedJobs: jobs.filter(j => j.status === 'COMPLETED').length,
    failedJobs: jobs.filter(j => j.status === 'FAILED').length,
    jobs
  });
}

// src/workers/audit.worker.js
// Standalone BullMQ Worker for Node.js / VPS deployment
require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { runAuditPipeline } = require('../services/audit-runner');

const QUEUE_NAME = 'seo-audit-jobs';
const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

console.log('====================================================');
console.log('🚀 SEO Automation Engine — BullMQ Background Worker');
console.log('Queue Name:', QUEUE_NAME);
console.log('Redis Host:', redisUrl ? redisUrl.replace(/:[^:@]+@/, ':****@') : 'Local / Not set (Simulation Mode)');
console.log('====================================================');

if (!redisUrl) {
  console.log('[Worker] REDIS_URL not set. Running in Standalone Worker Simulation Mode.');
  console.log('[Worker] Ready to process audit jobs dispatched from Next.js API routes.');
} else {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
  });

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      console.log(`\n[Worker] ⚡ Received Job ID: ${job.id}`);
      console.log(`[Worker] Target Audit ID: ${job.data.auditId}`);
      const result = await runAuditPipeline(job.data.auditId);
      return result;
    },
    { connection, concurrency: 2 }
  );

  worker.on('ready', () => {
    console.log(`[Worker] ✅ Connected to Redis! Listening for jobs on "${QUEUE_NAME}"...`);
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] 🎉 Job ${job.id} completed! Audit report generated.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] ❌ Job ${job?.id} failed:`, err.message);
  });
}


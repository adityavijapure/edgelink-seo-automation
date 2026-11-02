// src/workers/audit.worker.js
// Standalone BullMQ Worker for Node.js / VPS deployment
try {
  require('dotenv').config();
} catch (e) {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { runAuditPipeline } = require('../services/audit-runner');

const QUEUE_NAME = 'seo-audit-jobs';
const redisUrl = (process.env.UPSTASH_REDIS_URL && !process.env.UPSTASH_REDIS_URL.includes('YOUR_UPSTASH'))
  ? process.env.UPSTASH_REDIS_URL
  : (process.env.REDIS_URL && !process.env.REDIS_URL.includes('YOUR_') ? process.env.REDIS_URL : null);

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
    retryStrategy(times) {
      const delay = Math.min(times * 1000, 5000);
      return delay;
    },
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
  });

  connection.on('error', (err) => {
    if (err.code === 'ECONNREFUSED' || err.code === 'EACCES') {
      console.warn('[Worker Notice] Waiting for Redis connection at ' + redisUrl + '...');
    } else {
      console.warn('[Worker Notice] Redis status:', err.message);
    }
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


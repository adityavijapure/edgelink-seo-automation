// src/lib/queue.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const QUEUE_NAME = 'seo-audit-jobs';

let auditQueue = null;
let auditWorker = null;
let redisConnection = null;

const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

if (redisUrl) {
  try {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    });

    redisConnection.on('error', (err) => {
      // Graceful suppression when Redis is offline in local dev
    });

    auditQueue = new Queue(QUEUE_NAME, { connection: redisConnection });
    console.log(`[BullMQ] Configured Redis queue: ${QUEUE_NAME}`);
  } catch (err) {
    console.warn('[BullMQ] Redis connection error, falling back to local queue runner:', err.message);
  }
}

async function addAuditJob(auditId, payload = {}) {
  if (auditQueue) {
    try {
      const job = await auditQueue.add('process-audit', { auditId, ...payload }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: false,
        removeOnFail: false
      });
      return { success: true, jobId: job.id, isBullMQ: true };
    } catch (err) {
      console.warn('[BullMQ] Queue add failed, falling back to async runner:', err.message);
    }
  }

  // Graceful fallback when Redis is not connected
  return { success: true, jobId: `job-${auditId}`, isBullMQ: false };
}

function initWorker(processJobFn) {
  if (redisConnection && !auditWorker) {
    try {
      auditWorker = new Worker(
        QUEUE_NAME,
        async (job) => {
          console.log(`[BullMQ Worker] Processing job ${job.id} for audit:`, job.data.auditId);
          return await processJobFn(job.data.auditId);
        },
        { connection: redisConnection, concurrency: 2 }
      );

      auditWorker.on('completed', (job) => {
        console.log(`[BullMQ Worker] Job ${job.id} completed successfully`);
      });

      auditWorker.on('failed', (job, err) => {
        console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
      });

      console.log(`[BullMQ] Worker started listening on queue: ${QUEUE_NAME}`);
    } catch (err) {
      console.warn('[BullMQ Worker] Could not start worker:', err.message);
    }
  }
  return auditWorker;
}

module.exports = {
  QUEUE_NAME,
  auditQueue,
  redisConnection,
  addAuditJob,
  initWorker
};


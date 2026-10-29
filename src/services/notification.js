// src/services/notification.js
const { sendWhatsApp } = require('../mocks/twilio.mock');

async function notifyAuditCompletion(clientId, pdfPath, score, clientPhone) {
  try {
    const result = await sendWhatsApp(clientId, pdfPath, score);
    return {
      success: true,
      result,
      recipient: clientPhone || '+91 98200 12345'
    };
  } catch (err) {
    console.error('[Notification Error]:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { notifyAuditCompletion };

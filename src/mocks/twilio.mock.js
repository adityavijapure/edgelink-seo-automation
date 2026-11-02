// src/mocks/twilio.mock.js
// Section 2.3 specification - Twilio WhatsApp console.log mock
async function sendWhatsApp(clientId, pdfPath, score, recipient = '+91 86240 86811') {
  if (recipient) {
    console.log('[MOCK WHATSAPP] → Recipient:', recipient);
  }
  console.log('[MOCK WHATSAPP] → Client:', clientId);
  console.log('[MOCK WHATSAPP] → Score: ', score + '/100');
  console.log('[MOCK WHATSAPP] → Report:', pdfPath);
  return { 
    status: 'mock_sent', 
    sid: 'MOCK_SID_' + Date.now(),
    recipient,
    timestamp: new Date().toISOString() 
  };
}

module.exports = { sendWhatsApp };

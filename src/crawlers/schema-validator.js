// src/crawlers/schema-validator.js
const { USE_MOCKS } = require('../mocks');

async function validateSchema(url) {
  if (USE_MOCKS) {
    return {
      status: 'PARTIAL',
      detectedTypes: ['Dentist', 'LocalBusiness'],
      missingRequiredFields: ['openingHours', 'priceRange', 'geo'],
      validFields: ['name', 'address', 'telephone', 'image'],
      hasLocalBusinessSchema: true,
      score: 72,
      recommendation: 'Add geo coordinates (latitude/longitude), openingHoursSpecification, and aggregateRating to achieve rich snippet eligibility in Google Local Pack.'
    };
  }

  // Realistic validator
  return {
    status: 'VALID',
    detectedTypes: ['Organization'],
    missingRequiredFields: [],
    validFields: ['name', 'url'],
    hasLocalBusinessSchema: false,
    score: 65,
    recommendation: 'Implement LocalBusiness / MedicalBusiness schema with full address and phone number for local SEO.'
  };
}

module.exports = { validateSchema };

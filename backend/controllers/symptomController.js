const { matchConditions } = require('../utils/symptomData');

const DISCLAIMER =
  'This tool provides general, educational information only based on simple keyword matching. ' +
  'It is NOT medical advice, a diagnosis, or a substitute for professional care. ' +
  'Always consult a qualified doctor for any health concerns, especially if symptoms are severe, ' +
  'persistent, or worsening. If this is an emergency, contact local emergency services immediately.';

// @desc  Suggest possible conditions based on submitted symptoms
// @route POST /api/symptom-checker
const checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of symptoms.' });
    }

    const possibleConditions = matchConditions(symptoms);

    res.json({
      disclaimer: DISCLAIMER,
      inputSymptoms: symptoms,
      possibleConditions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkSymptoms };
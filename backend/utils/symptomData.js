/**
 * Rule-based symptom -> possible condition reference dataset.
 *
 * IMPORTANT: This is a simple keyword-overlap matcher for general educational
 * purposes only. It is NOT a diagnostic tool and must NEVER be presented to
 * end users as medical advice. Always pair its output with a clear disclaimer
 * instructing users to consult a licensed healthcare professional.
 */

const conditions = [
  {
    name: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'cough', 'mild fever', 'congestion'],
    commonAdvice: 'Usually self-limiting; rest and fluids often help.'
  },
  {
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'chills', 'body ache', 'fatigue', 'cough', 'headache', 'sore throat'],
    commonAdvice: 'Rest, hydration; seek care if symptoms are severe or prolonged.'
  },
  {
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'sensitivity to light', 'vomiting', 'blurred vision'],
    commonAdvice: 'Rest in a quiet, dark room; consult a doctor for recurring episodes.'
  },
  {
    name: 'Gastroenteritis',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'dehydration'],
    commonAdvice: 'Stay hydrated with oral rehydration solutions; seek care if severe.'
  },
  {
    name: 'Allergic Rhinitis',
    symptoms: ['sneezing', 'itchy eyes', 'runny nose', 'congestion', 'watery eyes'],
    commonAdvice: 'Avoid known allergens; antihistamines may help, consult a pharmacist/doctor.'
  },
  {
    name: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'abdominal pain', 'fever', 'cloudy urine'],
    commonAdvice: 'Often needs antibiotics — consult a doctor for proper testing and treatment.'
  },
  {
    name: 'Hypertension (High Blood Pressure)',
    symptoms: ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath'],
    commonAdvice: 'Requires proper blood pressure monitoring and clinical evaluation.'
  },
  {
    name: 'Type 2 Diabetes (possible indicator)',
    symptoms: ['excessive thirst', 'frequent urination', 'fatigue', 'blurred vision', 'weight loss'],
    commonAdvice: 'Needs blood glucose testing — consult a doctor for confirmation.'
  },
  {
    name: 'Asthma / Respiratory distress',
    symptoms: ['shortness of breath', 'wheezing', 'chest tightness', 'cough'],
    commonAdvice: 'Seek prompt medical attention, especially if breathing difficulty is severe.'
  },
  {
    name: 'Dengue Fever',
    symptoms: ['high fever', 'severe headache', 'joint pain', 'muscle pain', 'rash', 'nausea'],
    commonAdvice: 'Seek medical attention promptly, especially in endemic regions.'
  },
  {
    name: 'COVID-19 (possible indicator)',
    symptoms: ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell', 'shortness of breath'],
    commonAdvice: 'Consider testing and isolation per local health guidelines; consult a doctor.'
  },
  {
    name: 'Anxiety Disorder (possible indicator)',
    symptoms: ['rapid heartbeat', 'sweating', 'restlessness', 'difficulty concentrating', 'fatigue'],
    commonAdvice: 'Consider speaking with a mental health professional for evaluation.'
  }
];

/**
 * Very simple overlap-scoring matcher.
 * @param {string[]} inputSymptoms - lowercase, trimmed symptom strings from the user
 * @returns {Array<{name: string, matchScore: number, matchedSymptoms: string[], commonAdvice: string}>}
 */
function matchConditions(inputSymptoms) {
  const normalized = inputSymptoms.map((s) => s.toLowerCase().trim()).filter(Boolean);

  const results = conditions
    .map((condition) => {
      const matched = condition.symptoms.filter((sym) =>
        normalized.some((input) => sym.includes(input) || input.includes(sym))
      );
      return {
        name: condition.name,
        matchedSymptoms: matched,
        matchScore: matched.length / condition.symptoms.length,
        commonAdvice: condition.commonAdvice
      };
    })
    .filter((r) => r.matchedSymptoms.length > 0)
    .sort((a, b) => b.matchScore - a.matchScore || b.matchedSymptoms.length - a.matchedSymptoms.length);

  return results.slice(0, 5); // top 5 possible matches only
}

module.exports = { conditions, matchConditions };
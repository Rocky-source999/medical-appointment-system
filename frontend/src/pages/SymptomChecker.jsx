import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DisclaimerBanner from '../components/DisclaimerBanner';

const SymptomChecker = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSymptom = (e) => {
    e.preventDefault();
    const val = symptomInput.trim().toLowerCase();
    if (val && !symptoms.includes(val)) {
      setSymptoms([...symptoms, val]);
    }
    setSymptomInput('');
  };

  const removeSymptom = (s) => setSymptoms(symptoms.filter((x) => x !== s));

  const handleCheck = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/symptom-checker', { symptoms });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Symptom Checker</h1>
      <DisclaimerBanner />

      <div className="symptom-input-row">
        <form onSubmit={addSymptom} className="symptom-form">
          <input
            type="text"
            placeholder="e.g. headache, fever, cough"
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
          />
          <button className="btn-primary-sm" type="submit">Add</button>
        </form>
      </div>

      <div className="symptom-tags">
        {symptoms.map((s) => (
          <span className="tag" key={s}>
            {s} <button onClick={() => removeSymptom(s)}>&times;</button>
          </span>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="btn-primary" onClick={handleCheck} disabled={loading}>
        {loading ? 'Checking...' : 'Check Possible Conditions'}
      </button>

      {result && (
        <div className="result-section">
          <h2>Possible Conditions</h2>
          {result.possibleConditions.length === 0 ? (
            <p>No matching conditions found in our reference data. Please consult a doctor.</p>
          ) : (
            <ul className="condition-list">
              {result.possibleConditions.map((c) => (
                <li key={c.name} className="condition-item">
                  <div className="condition-header">
                    <strong>{c.name}</strong>
                    <span className="match-score">{Math.round(c.matchScore * 100)}% keyword match</span>
                  </div>
                  <p className="muted">Matched symptoms: {c.matchedSymptoms.join(', ')}</p>
                  <p>{c.commonAdvice}</p>
                </li>
              ))}
            </ul>
          )}
          <DisclaimerBanner text={result.disclaimer} />
          <Link to="/doctors" className="btn-primary">Book an Appointment with a Doctor</Link>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;

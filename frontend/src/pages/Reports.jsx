import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyMed = { name: '', dosage: '', frequency: '', durationDays: '' };

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // doctor-only create-report form state
  const [form, setForm] = useState({
    patient: '',
    title: '',
    diagnosis: '',
    symptoms: '',
    rawNotes: '',
    medicines: [emptyMed]
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMedChange = (idx, field, value) => {
    const meds = [...form.medicines];
    meds[idx][field] = value;
    setForm({ ...form, medicines: meds });
  };

  const addMedRow = () => setForm({ ...form, medicines: [...form.medicines, { ...emptyMed }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/reports', {
        patient: form.patient,
        title: form.title,
        diagnosis: form.diagnosis,
        symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
        rawNotes: form.rawNotes,
        prescribedMedicines: form.medicines.filter((m) => m.name)
      });
      setShowForm(false);
      setForm({ patient: '', title: '', diagnosis: '', symptoms: '', rawNotes: '', medicines: [emptyMed] });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    }
  };

  return (
    <div className="container">
      <div className="page-header-row">
        <h1>Medical Reports</h1>
        {user.role === 'doctor' && (
          <button className="btn-primary-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Report'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          <label>Patient ID</label>
          <input
            type="text"
            placeholder="Paste patient's user ID"
            value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })}
            required
          />
          <label>Report Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label>Diagnosis</label>
          <input type="text" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

          <label>Symptoms (comma separated)</label>
          <input type="text" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="fever, cough" />

          <label>Prescribed Medicines</label>
          {form.medicines.map((m, idx) => (
            <div className="med-row" key={idx}>
              <input placeholder="Name" value={m.name} onChange={(e) => handleMedChange(idx, 'name', e.target.value)} />
              <input placeholder="Dosage" value={m.dosage} onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)} />
              <input placeholder="Frequency" value={m.frequency} onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)} />
              <input placeholder="Days" type="number" value={m.durationDays} onChange={(e) => handleMedChange(idx, 'durationDays', e.target.value)} />
            </div>
          ))}
          <button type="button" className="btn-secondary-sm" onClick={addMedRow}>+ Add Medicine</button>

          <label>Notes</label>
          <textarea rows={4} value={form.rawNotes} onChange={(e) => setForm({ ...form, rawNotes: e.target.value })} />

          <button className="btn-primary" type="submit">Save Report (auto-generates summary)</button>
        </form>
      )}

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="report-list">
          {reports.map((r) => (
            <div className="report-card" key={r._id}>
              <h3>{r.title}</h3>
              <p className="muted">
                {user.role === 'doctor' ? `Patient: ${r.patient?.name}` : `Doctor: ${r.doctor?.name || 'N/A'}`} •{' '}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
              {r.diagnosis && <p><strong>Diagnosis:</strong> {r.diagnosis}</p>}
              <div className="summary-box">
                <strong>Summary:</strong>
                <p>{r.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
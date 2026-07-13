import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DisclaimerBanner from '../components/DisclaimerBanner';

const emptyForm = {
  medicineName: '',
  dosage: '',
  frequency: '',
  times: '',
  startDate: '',
  endDate: ''
};

const MedicineReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reminders');
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/reminders', {
        ...form,
        times: form.times.split(',').map((t) => t.trim()).filter(Boolean)
      });
      setForm(emptyForm);
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reminder');
    }
  };

  const toggleActive = async (r) => {
    try {
      await api.put(`/reminders/${r._id}`, { active: !r.active });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Medicine Reminders</h1>
      <DisclaimerBanner text="Reminders help you stay on schedule but do not replace your doctor's or pharmacist's instructions. Always follow the dosage prescribed to you." />

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}
        <label>Medicine Name</label>
        <input required value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} />

        <label>Dosage</label>
        <input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} placeholder="e.g. 500mg" />

        <label>Frequency</label>
        <input required value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="e.g. twice daily" />

        <label>Times (comma separated, 24h format)</label>
        <input required value={form.times} onChange={(e) => setForm({ ...form, times: e.target.value })} placeholder="08:00, 20:00" />

        <label>Start Date</label>
        <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />

        <label>End Date</label>
        <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />

        <button className="btn-primary" type="submit">Add Reminder</button>
      </form>

      {loading ? (
        <p>Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <p>No reminders set.</p>
      ) : (
        <div className="reminder-list">
          {reminders.map((r) => (
            <div className={`reminder-card ${r.active ? '' : 'inactive'}`} key={r._id}>
              <h3>{r.medicineName} {r.dosage && `(${r.dosage})`}</h3>
              <p>{r.frequency} at {r.times.join(', ')}</p>
              <p className="muted">
                {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
              </p>
              <div className="reminder-actions">
                <button className="btn-secondary-sm" onClick={() => toggleActive(r)}>
                  {r.active ? 'Pause' : 'Resume'}
                </button>
                <button className="btn-danger-sm" onClick={() => deleteReminder(r._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineReminders;
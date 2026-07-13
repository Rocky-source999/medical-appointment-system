import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/doctors/${doctorId}`).then((res) => setDoctor(res.data)).catch(() => {});
  }, [doctorId]);

  const availableSlots = () => {
    if (!doctor || !date) return [];
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability?.find((a) => a.day === dayName);
    return dayAvailability?.slots || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!date || !timeSlot) {
      setError('Please select a date and time slot.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/appointments', { doctor: doctorId, date, timeSlot, reason });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => navigate('/appointments'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div className="container"><p>Loading doctor info...</p></div>;

  const slots = availableSlots();

  return (
    <div className="container">
      <h1>Book Appointment with Dr. {doctor.name}</h1>
      <p className="muted">{doctor.specialization || 'General Physician'}</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <label>Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => { setDate(e.target.value); setTimeSlot(''); }}
          required
        />
        <label>Time Slot</label>
        {date && slots.length === 0 ? (
          <p className="muted">No slots configured by the doctor for this day. You may still enter a preferred time.</p>
        ) : null}
        {slots.length > 0 ? (
          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
            <option value="">Select a slot</option>
            {slots.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="e.g. 10:00-10:30"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          />
        )}
        <label>Reason for visit (optional)</label>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
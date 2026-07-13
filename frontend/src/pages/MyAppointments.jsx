import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled'
};

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container">
      <h1>My Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{user.role === 'doctor' ? 'Patient' : 'Doctor'}</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{user.role === 'doctor' ? appt.patient?.name : `Dr. ${appt.doctor?.name}`}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.timeSlot}</td>
                  <td>{appt.reason || '-'}</td>
                  <td><span className={`badge ${statusColors[appt.status]}`}>{appt.status}</span></td>
                  <td className="actions-cell">
                    {user.role === 'doctor' && appt.status === 'pending' && (
                      <button className="btn-primary-sm" onClick={() => updateStatus(appt._id, 'confirmed')}>Confirm</button>
                    )}
                    {user.role === 'doctor' && appt.status === 'confirmed' && (
                      <button className="btn-primary-sm" onClick={() => updateStatus(appt._id, 'completed')}>Mark Completed</button>
                    )}
                    {['pending', 'confirmed'].includes(appt.status) && (
                      <button className="btn-danger-sm" onClick={() => updateStatus(appt._id, 'cancelled')}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
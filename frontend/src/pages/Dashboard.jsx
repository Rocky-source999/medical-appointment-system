import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Welcome, {user.name} 👋</h1>
      <p className="muted">Role: {user.role}</p>

      <div className="dashboard-grid">
        <Link to="/doctors" className="dashboard-card">
          <h3>👨‍⚕️ Find Doctors</h3>
          <p>Browse doctors by specialization and book an appointment.</p>
        </Link>

        <Link to="/appointments" className="dashboard-card">
          <h3>📅 Appointments</h3>
          <p>View and manage your upcoming and past appointments.</p>
        </Link>

        {user.role === 'patient' && (
          <>
            <Link to="/symptom-checker" className="dashboard-card">
              <h3>🩺 Symptom Checker</h3>
              <p>Get general suggestions based on your symptoms.</p>
            </Link>
            <Link to="/reminders" className="dashboard-card">
              <h3>⏰ Medicine Reminders</h3>
              <p>Set up and manage your medicine reminders.</p>
            </Link>
          </>
        )}

        <Link to="/reports" className="dashboard-card">
          <h3>📄 Reports</h3>
          <p>{user.role === 'doctor' ? 'Create and view patient reports.' : 'View your medical reports and summaries.'}</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
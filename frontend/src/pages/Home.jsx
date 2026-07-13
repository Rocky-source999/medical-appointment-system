import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Your Health, Simplified.</h1>
        <p>
          Book appointments with trusted doctors, check your symptoms, keep track of
          your medical reports, and never miss a medicine dose again.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        )}
        {user && (
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          </div>
        )}
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>📅 Book Appointments</h3>
          <p>Find doctors by specialization and book a convenient time slot.</p>
        </div>
        <div className="feature-card">
          <h3>🩺 Symptom Checker</h3>
          <p>Get general, educational suggestions based on your symptoms.</p>
        </div>
        <div className="feature-card">
          <h3>📄 Report Summaries</h3>
          <p>Auto-generated summaries of your medical reports.</p>
        </div>
        <div className="feature-card">
          <h3>⏰ Medicine Reminders</h3>
          <p>Never miss a dose with scheduled medicine reminders.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
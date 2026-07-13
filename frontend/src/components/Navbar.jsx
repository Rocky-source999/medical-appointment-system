import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">🩺 MediCare</Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/doctors" onClick={() => setOpen(false)}>Doctors</Link>
              {user.role === 'patient' && (
                <>
                  <Link to="/appointments" onClick={() => setOpen(false)}>My Appointments</Link>
                  <Link to="/symptom-checker" onClick={() => setOpen(false)}>Symptom Checker</Link>
                  <Link to="/reports" onClick={() => setOpen(false)}>Reports</Link>
                  <Link to="/reminders" onClick={() => setOpen(false)}>Reminders</Link>
                </>
              )}
              {user.role === 'doctor' && (
                <>
                  <Link to="/appointments" onClick={() => setOpen(false)}>My Appointments</Link>
                  <Link to="/reports" onClick={() => setOpen(false)}>Reports</Link>
                </>
              )}
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary-sm" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

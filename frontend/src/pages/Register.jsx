import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    specialization: '',
    qualifications: '',
    experienceYears: '',
    consultationFee: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        {error && <p className="error-text">{error}</p>}

        <label>I am a</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />

        <label>Phone</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} />

        {form.role === 'doctor' && (
          <>
            <label>Specialization</label>
            <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiology" />

            <label>Qualifications</label>
            <input type="text" name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g. MBBS, MD" />

            <label>Years of Experience</label>
            <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} min={0} />

            <label>Consultation Fee</label>
            <input type="number" name="consultationFee" value={form.consultationFee} onChange={handleChange} min={0} />
          </>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
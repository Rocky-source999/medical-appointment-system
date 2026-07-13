import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors', { params: { search, specialization } });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="container">
      <h1>Find a Doctor</h1>

      <form className="filter-bar" onSubmit={handleFilter}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Specialization (e.g. Cardiology)"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <button className="btn-primary" type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <h3>Dr. {doc.name}</h3>
              <p className="muted">{doc.specialization || 'General Physician'}</p>
              {doc.qualifications && <p>{doc.qualifications}</p>}
              {doc.experienceYears != null && <p>{doc.experienceYears} yrs experience</p>}
              {doc.consultationFee != null && <p>Fee: ₹{doc.consultationFee}</p>}
              {user?.role === 'patient' && (
                <Link className="btn-primary-sm" to={`/book/${doc._id}`}>Book Appointment</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
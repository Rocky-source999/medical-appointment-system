import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import SymptomChecker from './pages/SymptomChecker';
import Reports from './pages/Reports';
import MedicineReminders from './pages/MedicineReminders';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/book/:doctorId" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/symptom-checker" element={<ProtectedRoute roles={['patient']}><SymptomChecker /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute roles={['patient']}><MedicineReminders /></ProtectedRoute>} />

          <Route path="*" element={<div className="container"><h2>Page not found</h2></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
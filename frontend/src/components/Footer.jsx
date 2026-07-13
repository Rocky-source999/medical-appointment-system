import React from 'react';

const Footer = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} MediCare Appointment System. For demonstration purposes only.</p>
    <p className="footer-disclaimer">
      Not a substitute for professional medical advice, diagnosis, or treatment.
    </p>
  </footer>
);

export default Footer;

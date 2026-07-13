import React from 'react';

const DisclaimerBanner = ({ text }) => (
  <div className="disclaimer-banner" role="note">
    <span className="disclaimer-icon">⚠️</span>
    <p>
      {text ||
        'This information is for general educational purposes only and is NOT medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.'}
    </p>
  </div>
);

export default DisclaimerBanner;

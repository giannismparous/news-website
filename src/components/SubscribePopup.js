import React, { useState } from 'react';

import '../styles/SubscribePopup.css';

const SubscribePopup = ({ onClose }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Subscribing user with email: ${email}`);
    onClose();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={onClose}>&#x2715;</button>
        <h2>Διάβασε, μάθε, ενημερώσου! Εγγραφή για τα πιο ενδιαφέροντα άρθρα!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Πληκτρολογήστε το email σας"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button type="submit" className='newsletter-submit-button'>Εγγραφή</button>
        </form>
      </div>
    </div>
  );
};

export default SubscribePopup;

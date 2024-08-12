import React, { useState } from 'react';
import '../styles/About.css'; // Import the Contact CSS

const About = () => {


    return (
        <div className="about-container">
            <h1>Ποίοι είμαστε;</h1>
            <p>
            Στην ιστοσελίδα <span className='bold'>syntaktes.gr</span> δημοσιογράφοι και ειδικοί συνεργάτες
αποκαλύπτουν, καταγράφουν και αναλύουν τα γεγονότα, χωρίς δεσμεύσεις. Και φέρνουν
στο φως όλα όσα μεθοδεύονται σε πολιτικά, οικονομικά, πολιτιστικά και εργοδοτικά κέντρα
αποφάσεων, σε βάρος της ενημέρωσης. Η άλλη όψη του νομίσματος είναι εδώ.
            </p>
        </div>
    );
};

export default About;


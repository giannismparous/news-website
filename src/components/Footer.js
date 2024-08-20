import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-description">
                <p>To syntaktes.gr είναι ιστοσελίδα που επιδιώκει να φωτίσει την άλλη όψη των κρίσιμων
γεγονότων, αναζητώντας απαντήσεις ανάμεσα στις γραμμές και επιμένοντας ότι η είδηση
είναι ζόρικη υπόθεση και ΔΕΝ έχει χορηγούς.</p>
            </div>
            <div className="footer-social">
                <ul>
                    <li><a href="https://www.facebook.com/kedpress.esiea">Facebook</a></li>
                    {/* <li><a href="https://www.linkedin.com">LinkedIn</a></li> */}
                    {/* <li><a href="https://www.twitter.com">Twitter</a></li> */}
                    <li><a href="https://www.youtube.com">YouTube</a></li>
                </ul>
            </div>
            <div className="footer-links">
                <ul>
                    <li><a href="/about">Ποιοι είμαστε</a></li>
                    <li><a href="/contact">Επικοινωνία</a></li>
                    {/* <li><a href="/advertising">Διαφήμιση</a></li> */}
                    <li><a href="/terms">Όροι Χρήσης</a></li>
                    {/* <li><a href="/submit-article">Στείλτε το άρθρο σας!</a></li> */}
                    {/* <li><a href="/magazine">Τεύχη syntaktes Magazine</a></li> */}
                </ul>
            </div>
            <div className="footer-copyright">
                <p>© Copyright 2024, All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-description">
                <p>Το syntaktes.gr είναι ιστοσελίδα που ασχολείται με άμυνα, την πολιτική που την επηρεάζει, την εξωτερική πολιτική και την διπλωματία. Σε όλα αυτά πρωταγωνιστικό ρόλο παίζουν πάντα άνθρωποι που με τις αποφάσεις τους καθορίζουν την τύχη μας και για αυτό πρέπει να είναι πάντα υπό κριτική.</p>
            </div>
            <div className="footer-social">
                <ul>
                    <li><a href="https://www.facebook.com">Facebook</a></li>
                    <li><a href="https://www.linkedin.com">LinkedIn</a></li>
                    <li><a href="https://www.twitter.com">Twitter</a></li>
                    <li><a href="https://www.youtube.com">YouTube</a></li>
                </ul>
            </div>
            <div className="footer-links">
                <ul>
                    <li><a href="/about">Ποιοι είμαστε</a></li>
                    <li><a href="/contact">Επικοινωνία</a></li>
                    <li><a href="/advertising">Διαφήμιση</a></li>
                    <li><a href="/terms">Όροι Χρήσης</a></li>
                    <li><a href="/submit-article">Στείλτε το άρθρο σας!</a></li>
                    <li><a href="/magazine">Τεύχη syntaktes Magazine</a></li>
                </ul>
            </div>
            <div className="footer-copyright">
                <p>© Copyright 2024, All Rights Reserved | Created and supported by NoeticBlue & SDM.</p>
            </div>
        </footer>
    );
};

export default Footer;

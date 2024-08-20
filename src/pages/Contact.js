import React, { useState } from 'react';
import '../styles/Contact.css'; // Import the Contact CSS
import { Helmet } from 'react-helmet-async';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to server
        console.log('Form submitted:', formData);
        // Reset the form
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="contact-container">
            <Helmet>
                <title>Επικοινωνία</title>  
                <meta name="description" content="Επικοινωνία με τα μέλη του Syntaktes.gr"/>
                <link rel="canonical" href="/contact"/>
            </Helmet>
            <h1>Επικοινωνήστε</h1>
            <form className="contact-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Όνομα</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="message">Μύνημα</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
                <button type="submit">Υποβολή</button>
            </form>
        </div>
    );
};

export default Contact;

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import '../styles/Contact.css';

const groups = [
  {
    id: process.env.REACT_APP_MAILERLITE_API_CONTACT_ID,
    name: process.env.REACT_APP_MAILERLITE_API_CONTACT_NAME
  },
]

const Contact = () => {

  useEffect(() => {
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []); 

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
        
        console.log('Form submitted:', formData);
        
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };


    const [selectedGroups, setSelectedGroups] = useState([]);

    useEffect(() => {
        const groupIds = groups.map(group => group.id);
        setSelectedGroups(groupIds);
      }, []);

      const handleSendContactEmail = async (formData, groupIds) => {

        console.log(formData)
        console.log(groupIds)
        try {

          const response = await fetch('/.netlify/functions/sendContactEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Authorization': `Bearer nfp_3Pyg2D92Bwsxk2zfCFfQ34mJEVURpkRrb1ce`
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              message: formData.message,
              groupIds: groupIds
            }),
          });

          const data = await response;

        if (response.ok) {
          alert('Η φόρμα καταχωρήθηκε επιτυχώς!');
        } else {
          alert('Αποτυχία!');
        console.error('Αποτυχία:', data);
        return false;
        }

        } catch (error) {
          alert('Σφάλμα. Η καταχώρηση φόρμας απέτυχε!');
          console.error('Error submitting form:', error);
        }
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
                <button type="submit" onClick={() => handleSendContactEmail(formData, selectedGroups)}>Υποβολή</button>
            </form>
        </div>
    );
};

export default Contact;

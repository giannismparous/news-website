import React, { useEffect, useState } from 'react';
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

    const groups = [
        {
          id: process.env.REACT_APP_MAILERLITE_API_CONTACT_ID,
          name: process.env.REACT_APP_MAILERLITE_API_CONTACT_NAME
        },
    ]

    const [selectedGroups, setSelectedGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    

    useEffect(() => {
        const groupIds = groups.map(group => group.id);
        setSelectedGroups(groupIds);
      }, []);

      const handleSendContactEmail = async (formData, groupIds) => {
        try {

          setLoading(true);
          
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

          console.log(2222)
          const data = await response;
          console.log(33333)

        if (response.ok) {
        console.log('Το email στάλθηκε επιτυχώς:', data);
        } else {
        console.error('Αποτυχία:', data);
        return false;
        }

          setLoading(false);

        } catch (error) {
          alert('Σφάλμα. Η αποστολή newsletter απέτυχε!');
          console.error('Error sending newsletter:', error);
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

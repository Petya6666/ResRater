import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        felhasznev: '',
        email: '',
        jelszo: '',
        jelszoUjra: '' // New field for password confirmation
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (formData.jelszo !== formData.jelszoUjra) {
            alert('A jelszavak nem egyeznek!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/register', {
                felhasznev: formData.felhasznev,
                email: formData.email,
                jelszo: formData.jelszo
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                alert(response.data.message);
                // clear all inputs on success
                setFormData({ felhasznev: '', email: '', jelszo: '', jelszoUjra: '' });
            } else {
                alert(response.data.error || 'Hiba történt a regisztráció során.');
            }
        } catch (error) {
            console.error('Hiba történt:', error.response?.data || error);
            alert(error.response?.data?.error || 'Hiba történt a regisztráció során.');
        }
    };

    return (
        <div>
            <Header />
            <div className='login-doboz'>
                <h2>Regisztráció</h2>
                <div>
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <input
                                className="input-field"
                                type={key === 'email' ? 'email' : key.includes('jelszo') ? 'password' : 'text'}
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={key === 'felhasznev' ? 'Felhasználó név' : key === 'email' ? 'E-mail' : key === 'jelszo' ? 'Jelszó' : key === 'jelszoUjra' ? 'Jelszó újra' : key}
                                required
                            />
                        </div>
                    ))}
                    <button className='bejelentkezes-gomb' onClick={handleSubmit}>Regisztráció</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
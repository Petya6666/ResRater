import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

const Login = () => {
    const [formData, setFormData] = useState({
        felhasznev: '',
        email: '',
        jelszo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                setFormData({
                    felhasznev: '',
                    email: '',
                    jelszo: ''
                });
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            alert('Hiba történt a regisztráció során.');
        }
    };

    return (
        <div>
            <Header />
            <div className='login-doboz'>
                <h2>Bejelentkezés</h2>
                <div>
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                            <input
                                type={key === 'email' ? 'email' : key === 'jelszo' ? 'password' : 'text'}
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={key}
                                required
                            />
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Regisztráció</button>
                </div>
            </div>
        </div>
    );
};

export default Login;

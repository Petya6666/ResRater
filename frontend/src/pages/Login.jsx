import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

const Login = () => {
    const [formData, setFormData] = useState({
        azonosito: '',
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
            const response = await axios.post(
                'http://localhost:3000/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert(response.data.message);
                setFormData({
                    azonosito: '',
                    jelszo: ''
                });
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            alert('Hibás belépési adatok.');
        }
    };

    return (
        <div>
            <Header />
            <div className='login-doboz'>
                <h2>Bejelentkezés</h2>
                <div>
                    <input
                        className="input-field"
                        type="text"
                        name="azonosito"
                        value={formData.azonosito}
                        onChange={handleChange}
                        placeholder="E-mail vagy felhasználónév"
                        required
                    />

                    <input
                        className="input-field"
                        type="password"
                        name="jelszo"
                        value={formData.jelszo}
                        onChange={handleChange}
                        placeholder="Jelszó"
                        required
                    />

                    <button
                        className='bejelentkezes-gomb'
                        onClick={handleSubmit}
                    >
                        Bejelentkezés
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

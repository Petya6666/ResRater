import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

/*
később így kell használni api hívásoknál a tokent:

const token = localStorage.getItem('token');

axios.get('http://localhost:3000/profile', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
*/

const Login = () => {
    const [formData, setFormData] = useState({
        azonosito: '',
        jelszo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.azonosito || !formData.jelszo) {
            alert('Minden mezőt ki kell tölteni!');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/login',
                {
                    azonosito: formData.azonosito,
                    jelszo: formData.jelszo
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            localStorage.setItem('token', response.data.token);

            alert(response.data.message);

            setFormData({
                azonosito: '',
                jelszo: ''
            });


        } catch (error) {
            console.error('LOGIN ERROR:', error.response?.data || error);
            alert(error.response?.data?.error || 'Hibás belépési adatok.');
        }
    };

    return (
        <div>
            <Header />
            <div className='login-doboz'>
                <h2>Bejelentkezés</h2>

                <input
                    className="input-field"
                    type="text"
                    name="azonosito"
                    value={formData.azonosito}
                    onChange={handleChange}
                    placeholder="E-mail vagy felhasználónév"
                />

                <input
                    className="input-field"
                    type="password"
                    name="jelszo"
                    value={formData.jelszo}
                    onChange={handleChange}
                    placeholder="Jelszó"
                />

                <button
                    className='bejelentkezes-gomb'
                    onClick={handleSubmit}
                >
                    Bejelentkezés
                </button>
            </div>
        </div>
    );
};

export default Login;

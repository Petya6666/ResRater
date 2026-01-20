import React, { useState } from 'react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            alert('Hiba történt a regisztráció során.');
        }
    };

    return (
        <>
            <Header />
            <div className='login-doboz'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="felhasznev">Felhasználónév:</label>
                        <input
                            type="text"
                            id="felhasznev"
                            name="felhasznev"
                            value={formData.felhasznev}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="jelszo">Jelszó:</label>
                        <input
                            type="password"
                            id="jelszo"
                            name="jelszo"
                            value={formData.jelszo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Regisztráció</button>
                </form>
            </div>
        </>
    );
};

export default Login;
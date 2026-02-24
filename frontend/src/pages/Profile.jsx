import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import '../styles/index.css';

function Profile(){
    const [felhasznev, setFelhasznev] = useState('');
    const [regiJelszo, setRegiJelszo] = useState('');
    const [ujJelszo, setUjJelszo] = useState('');

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!felhasznev.trim()) {
            alert('Add meg az új felhasználónevet!');
            return;
        }
        // ide jön majd az API hívás
        alert('Felhasználónév sikeresen módosítva! (teszt)');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!regiJelszo || !ujJelszo) {
            alert('Tölts ki minden jelszó mezőt!');
            return;
        }
        if (regiJelszo === ujJelszo) {
            alert('Az új jelszónak különböznie kell a régi jelszótól!');
            return;
        }
        // ide jön majd az API hívás
        alert('Jelszó sikeresen módosítva! (teszt)');
    };

    return (
        <div>
            <Header />

            <div className='login-doboz'>
                <h2>Felhasználónév módosítása</h2>
                <input
                    className="input-field"
                    type="text"
                    value={felhasznev}
                    onChange={(e) => setFelhasznev(e.target.value)}
                    placeholder="Új felhasználónév"
                />
                <button
                    className='bejelentkezes-gomb'
                    onClick={handleUsernameSubmit}
                >
                    Mentés
                </button>
           

            
                <h2>Jelszó módosítása</h2>
                <input
                    className="input-field"
                    type="password"
                    value={regiJelszo}
                    onChange={(e) => setRegiJelszo(e.target.value)}
                    placeholder="Régi jelszó"
                />
                <input
                    className="input-field"
                    type="password"
                    value={ujJelszo}
                    onChange={(e) => setUjJelszo(e.target.value)}
                    placeholder="Új jelszó"
                />
                <button
                    className='bejelentkezes-gomb'
                    onClick={handlePasswordSubmit}
                >
                    Mentés
                </button>
            </div>
        </div>
    );
}

export default Profile;
import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import '../styles/index.css';

function Profile(){
    const [felhasznev, setFelhasznev] = useState('');
    const [regiJelszo, setRegiJelszo] = useState('');
    const [ujJelszo, setUjJelszo] = useState('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('felhasznev') || 'Felhasználó';

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!felhasznev.trim()) {
            alert('Add meg az új felhasználónevet!');
            return;
        }
        if (!userId) {
            alert('Nincs bejelentkezett felhasználó.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/users/${userId}/username`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ felhasznev })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Hiba történt a felhasználónév módosításakor.');
                return;
            }

            alert(data.message || 'Felhasználónév sikeresen módosítva.');
            if (data.felhasznev) {
                localStorage.setItem('felhasznev', data.felhasznev);
            }
            setFelhasznev(''); 
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Szerver hiba történt.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!regiJelszo || !ujJelszo) {
            alert('Tölts ki minden jelszó mezőt!');
            return;
        }
        if (regiJelszo === ujJelszo) {
            alert('Az új jelszónak különböznie kell a régi jelszótól!');
            return;
        }
        if (!userId) {
            alert('Nincs bejelentkezett felhasználó.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/users/${userId}/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ regiJelszo, ujJelszo })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Hiba történt a jelszó módosításakor.');
                return;
            }

            alert(data.message || 'Jelszó sikeresen módosítva.');
            setRegiJelszo('');
            setUjJelszo('');
        } catch (err) {
            console.error(err);
            alert('Szerver hiba történt.');
        }
    };

    return (
        <div>
            <Header />

            <div className='login-doboz'>
                <h2 className='felhasznalo'>Üdv, {storedName}!</h2>
                <br />
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
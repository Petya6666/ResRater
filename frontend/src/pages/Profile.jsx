import React from 'react';
import Header from '../components/Header.jsx';
import '../styles/index.css';

function Profile(){
    return (
    <>
      <Header />
      <br />
        <div className='doboz'>
        <h1>Profil oldal</h1>
        <br />
        <p>Ez a profil oldal. Itt megjelenítheted a felhasználói adataidat, értékeléseidet és egyéb információkat.</p>
        <br />
        <br />
        </div>
    </>
    )
}

export default Profile;
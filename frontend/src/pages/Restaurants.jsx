import React from 'react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react';    
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const Restaurants = () => {
 const [ettermek,setettermek]=useState([]);
 const navigate = useNavigate();

 useEffect(() => {
  const fetchAllEttermek = async () => {
    try {
      const result = await axios.get('http://localhost:3000/browserettermek');
      console.log('Ettermek data:', result.data); // Debug log

      const updatedData = result.data.map(etterem => ({
        ...etterem,
        url: etterem.fajl_nev.startsWith('kepek/')
          ? `http://localhost:3000/${etterem.fajl_nev}`
          : `http://localhost:3000/kepek/${etterem.fajl_nev}`
      }));

      setettermek(updatedData);
    } catch (error) {
      console.error('Hiba az éttermek lekérése során:', error);
    }
  };

  fetchAllEttermek();
}, []);

  const handleCardClick = (etterem) => {
    console.log('Clicked restaurant:', etterem); 
    navigate(`/restaurant/${etterem.etterem_id}`);
};

  return (
    <>
      <Header />
      <div className='container mt-4'>
        <h2 className='mb-4'>Éttermek</h2>
        {ettermek.length === 0 && <p>Nincsenek éttermek...</p>}
        <div className='row'>
          {ettermek.map((etterem) => (
            <div key={etterem.etterem_id} className='col-md-4 mb-4'>
              <div 
                className='card h-100' 
                onClick={() => handleCardClick(etterem)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img className='card-img-top' src={etterem.url} alt={etterem.nev} style={{ height: '200px', objectFit: 'cover' }} />
                <div className='card-body'>
                  <h5 className='card-title'>{etterem.nev}</h5>
                  <p className='card-text'>Város: {etterem.varos}</p>
                  <p className='card-text'>Átlagos értékelés: {etterem.atlag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Restaurants;
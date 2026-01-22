import React from 'react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react';    
import axios from 'axios';
import '../styles/index.css';

const Restaurants = () => {
 const [ettermek,setettermek]=useState([]);

 useEffect(() => {
  const fetchAllEttermek = async () => {
    try {
      const result = await axios.get('http://localhost:3000/browserettermek');
      setettermek(result.data);
    } catch (error) {
      console.error('Hiba az éttermek lekérése során:', error);
    }
  };

  fetchAllEttermek();
}, []);
  return (
    <>
      <Header />
      <div className='container mt-4'>
        <div className='row'>
          {ettermek.map((etterem) => (
            <div key={etterem.nev} className='col-md-4 mb-4'>
              <div className='card'>
                <div className='card-body'>
                  <img className='card-img-top' src={etterem.url} alt={etterem.nev}  />
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

const Restaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [etterem, setEtterem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEtterem = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/etterem/${id}`);
        setEtterem(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Hiba az étterem lekérése során:', error);
        setError('Nem sikerült betölteni az éttermet');
        setLoading(false);
      }
    };

    fetchEtterem();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className='container mt-4'>
          <h2>Betöltés...</h2>
        </div>
      </>
    );
  }

  if (error || !etterem) {
    return (
      <>
        <Header />
        <div className='container mt-4'>
          <p className='text-danger'>{error || 'Étterem nem található'}</p>
          <button className='btn btn-primary' onClick={() => navigate('/restaurants')}>
            Vissza az éttermekhez
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='container mt-4 d-flex justify-content-center'>
        <div style={{ maxWidth: '1000px', width: '100%' }}>
          <button className='piros mb-3' onClick={() => navigate('/restaurants')}>
            ← Vissza
          </button>
          
          <div className='doboz row'>
            <div className='col-md-6'>
              <img 
                src={etterem.url} 
                alt={etterem.nev} 
                className='img-fluid rounded'
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            
            <div className='col-md-6'>
              <h1>{etterem.nev}</h1>
              <hr />
              
              <div className='mb-3'>
                <h5>Leírás:</h5>
                <p>{etterem.leiras || 'Nincs leírás'}</p>
              </div>
              
              <div className='mb-3'>
                <h5>Elérhetőség:</h5>
                <p><strong>Telefon:</strong> {etterem.telefon}</p>
                <p><strong>Város:</strong> {etterem.varos}</p>
                <p><strong>Irányítószám:</strong> {etterem.iranyitoszam}</p>
              </div>
              
              {etterem.kategoria && (
                <div className='mb-3'>
                  <h5>Kategória:</h5>
                  <p>{etterem.kategoria}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant;
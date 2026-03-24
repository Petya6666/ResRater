import React from 'react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const Restaurants = () => {
 const [ettermek,setettermek]=useState([]);
 const [query, setQuery] = useState('');
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 useEffect(() => {
  const fetchEttermek = async () => {
    setLoading(true);
    try {
      const endpoint = query.trim().length > 0
        ? `http://localhost:3000/ettermek/search?q=${encodeURIComponent(query.trim())}`
        : 'http://localhost:3000/browserettermek';

      const result = await axios.get(endpoint);

      const updatedData = result.data.map(etterem => ({
        ...etterem,
        url: typeof etterem.fajl_nev === 'string' && etterem.fajl_nev.startsWith('kepek/')
          ? `http://localhost:3000/${etterem.fajl_nev}`
          : `http://localhost:3000/kepek/${etterem.fajl_nev}`
      }));

      setettermek(updatedData);
    } catch (error) {
      console.error('Hiba az éttermek lekérése során:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = setTimeout(fetchEttermek, 300); 
  return () => clearTimeout(t);
}, [query]);

  const handleCardClick = (etterem) => {
    console.log('Clicked restaurant:', etterem); 
    navigate(`/restaurant/${etterem.etterem_id}`);
};

  return (
    <>
      <Header />
      <div className='container mt-4'>
        <div className='restaurants-header mb-3'>
          <h2 className='mb-0 feher'>Éttermek</h2>
          <input
            className='form-control restaurants-search'
            type='search'
            placeholder='Keresés (név vagy város)'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p>Keresés...</p>}
        {!loading && ettermek.length === 0 && <p>Nincsenek éttermek...</p>}

        <div className='row'>
          {ettermek.map((etterem) => (
            <div key={etterem.etterem_id} className='col-12 col-sm-6 col-lg-4 mb-4'>
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
import React from 'react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const Favourites = () => {
  const [kedvencek, setKedvencek] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const fetchKedvencek = async () => {
      setLoading(true);
      try {
        // Get favorite etterem IDs
        const favoriteRes = await axios.get('http://localhost:3000/kedvencek', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const favoriteIds = new Set(
          (Array.isArray(favoriteRes.data) ? favoriteRes.data : [])
            .map((f) => Number(f.etterem_id))
            .filter((id) => Number.isInteger(id))
        );

        if (favoriteIds.size === 0) {
          setKedvencek([]);
          setLoading(false);
          return;
        }

        // Fetch all restaurants and filter to favorites
        const allRes = await axios.get('http://localhost:3000/ettermek');
        const allPayload = allRes.data;
        const allRestaurants = Array.isArray(allPayload)
          ? allPayload
          : (Array.isArray(allPayload?.data) ? allPayload.data : []);

        const filteredData = allRestaurants
          .filter((r) => favoriteIds.has(Number(r.etterem_id)))
          .map(etterem => ({
            ...etterem,
            url: typeof etterem.fajl_nev === 'string' && etterem.fajl_nev.startsWith('kepek/')
              ? `http://localhost:3000/${etterem.fajl_nev}`
              : `http://localhost:3000/kepek/${etterem.fajl_nev}`
          }));

        setKedvencek(filteredData);
      } catch (error) {
        console.error('Hiba a kedvencek lekérése során:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKedvencek();
  }, [token, userId, navigate]);

  const handleCardClick = (etterem) => {
    navigate(`/restaurant/${etterem.etterem_id}`);
  };

  const handleRemoveFavorite = async (e, etterem_id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/kedvencek/${etterem_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKedvencek(kedvencek.filter(k => k.etterem_id !== etterem_id));
    } catch (error) {
      console.error('Hiba a kedvenc eltávolításakor:', error);
      alert('Hiba történt a kedvenc eltávolításakor.');
    }
  };

  return (
    <>
      <Header />
      <div className='container mt-4'>
        <div className='restaurants-header mb-3'>
          <h2 className='mb-0 feher'>Kedvenceim</h2>
        </div>

        {loading && <p className='feher'>Betöltés...</p>}
        {!loading && kedvencek.length === 0 && <p className='feher'>Nincs kedvenc éttermed.</p>}

        <div className='row'>
          {kedvencek.map((etterem) => (
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
                  {etterem.kategoria_nev && <p className='card-text'>Kategória: {etterem.kategoria_nev}</p>}
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={(e) => handleRemoveFavorite(e, etterem.etterem_id)}
                  >
                    Eltávolítás
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Favourites;

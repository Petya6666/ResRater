import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.jsx';
import '../styles/index.css';

const Restaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [etterem, setEtterem] = useState(null);
  const [kommentek, setKommentek] = useState([]);
  const [kommentLoading, setKommentLoading] = useState(false);
  const [kommentError, setKommentError] = useState(null);
  const [ujKomment, setUjKomment] = useState('');
  const [kuldesLoading, setKuldesLoading] = useState(false);
  const [kuldesError, setKuldesError] = useState(null);
  const [kuldesSuccess, setKuldesSuccess] = useState(null);
  const [torlesLoadingId, setTorlesLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  useEffect(() => {
    const fetchKommentek = async () => {
      setKommentLoading(true);
      setKommentError(null);
      try {
        const result = await axios.get(`http://localhost:3000/kommentek/${id}`);
        setKommentek(Array.isArray(result.data) ? result.data : []);
      } catch (e) {
        console.error('Hiba a kommentek lekérése során:', e);
        setKommentError('Nem sikerült betölteni a hozzászólásokat');
        setKommentek([]);
      } finally {
        setKommentLoading(false);
      }
    };

    if (id) fetchKommentek();
  }, [id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUserId(null);
        return;
      }

      try {
        const result = await axios.get('http://localhost:3000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(result?.data?.id ?? null);
      } catch {
        // invalid/expired token
        setCurrentUserId(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const refreshKommentek = async () => {
    const result = await axios.get(`http://localhost:3000/kommentek/${id}`);
    setKommentek(Array.isArray(result.data) ? result.data : []);
  };

  const handleKommentKuldes = async (e) => {
    e.preventDefault();
    setKuldesError(null);
    setKuldesSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setKuldesError('Komment írásához be kell jelentkezni.');
      return;
    }

    if (!ujKomment || ujKomment.trim().length === 0) {
      setKuldesError('A megjegyzés nem lehet üres.');
      return;
    }

    try {
      setKuldesLoading(true);
      await axios.post(
        'http://localhost:3000/kommentek',
        { etterem_id: Number(id), megjegyzes: ujKomment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUjKomment('');
      setKuldesSuccess('Komment elküldve.');

      // frissítés
      await refreshKommentek();
    } catch (err) {
      console.error('Hiba a komment küldése során:', err);
      const msg = err?.response?.data?.error || 'Nem sikerült elküldeni a kommentet';
      setKuldesError(msg);
    } finally {
      setKuldesLoading(false);
    }
  };

  const handleKommentTorles = async (kommentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setKuldesError('Komment törléséhez be kell jelentkezni.');
      return;
    }

    try {
      setTorlesLoadingId(kommentId);
      await axios.delete(`http://localhost:3000/kommentek/${kommentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshKommentek();
    } catch (err) {
      console.error('Hiba a komment törlése során:', err);
      const msg = err?.response?.data?.error || 'Nem sikerült törölni a kommentet';
      setKuldesError(msg);
    } finally {
      setTorlesLoadingId(null);
    }
  };

  const userAlreadyCommented =
    currentUserId != null &&
    kommentek.some((k) => Number(k.felhasznalo_id) === Number(currentUserId));



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
                src={etterem.fajl_nev.startsWith('kepek/') 
                  ? `http://localhost:3000/${etterem.fajl_nev}` 
                  : `http://localhost:3000/kepek/${etterem.fajl_nev}`} 
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
          <div className='mb-4'>
                <h5>Hozzászólások:</h5>

                {!userAlreadyCommented ? (
                  <form className='mb-3' onSubmit={handleKommentKuldes}>
                    <div className='mb-2'>
                      <label className='form-label' htmlFor='ujKomment'>Írj hozzászólást</label>
                      <textarea
                        id='ujKomment'
                        className='form-control'
                        rows={3}
                        value={ujKomment}
                        onChange={(e) => setUjKomment(e.target.value)}
                        placeholder='Írd ide a véleményed...'
                        disabled={kuldesLoading}
                      />
                    </div>

                    {kuldesError && <div className='text-danger mb-2'>{kuldesError}</div>}
                    {kuldesSuccess && <div className='text-success mb-2'>{kuldesSuccess}</div>}

                    <button className='btn btn-primary' type='submit' disabled={kuldesLoading}>
                      {kuldesLoading ? 'Küldés...' : 'Küldés'}
                    </button>
                  </form>
                ) : (
                  <p className='text-muted'>Már írtál hozzászólást ehhez az étteremhez.</p>
                )}

                {kommentLoading ? (
                  <p>Betöltés...</p>
                ) : kommentError ? (
                  <p className='text-danger'>{kommentError}</p>
                ) : kommentek.length > 0 ? (
                  <ul className='list-group'>
                    {kommentek.map((komment) => (
                      <li key={komment.komment_id} className='list-group-item'>
                        <div className='d-flex justify-content-between align-items-start gap-2'>
                          <div>
                            <p><strong>{komment.felhasznev}</strong> ({new Date(komment.letrehoz_ido).toLocaleDateString()}):</p>
                            <p>{komment.megjegyzes}</p>
                          </div>
                          {currentUserId != null && Number(komment.felhasznalo_id) === Number(currentUserId) && (
                            <button
                              className='btn btn-sm btn-outline-danger'
                              type='button'
                              onClick={() => handleKommentTorles(komment.komment_id)}
                              disabled={torlesLoadingId === komment.komment_id}
                              title='Komment törlése'
                            >
                              {torlesLoadingId === komment.komment_id ? 'Törlés...' : 'Törlés'}
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nincsenek hozzászólások.</p>
                )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant;
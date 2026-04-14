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

  // favorites
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState(null);

  // ratings
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null); // { osszesitett, sajat }
  const [etelminoseg, setEtelminoseg] = useState(0);
  const [kiszolgalas, setKiszolgalas] = useState(0);
  const [hangulat, setHangulat] = useState(0);

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

  const fetchRatings = async () => {
    setRatingError(null);
    try {
      const token = localStorage.getItem('token');
      const result = await axios.get(`http://localhost:3000/ertekelesek/osszefoglalo/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setRatingSummary(result.data);
      const own = result?.data?.sajat;
      if (own) {
        setEtelminoseg(Number(own.etelminoseg) || 0);
        setKiszolgalas(Number(own.kiszolgalas) || 0);
        setHangulat(Number(own.hangulat) || 0);
      } else {
        setEtelminoseg(0);
        setKiszolgalas(0);
        setHangulat(0);
      }
    } catch (e) {
      console.error('Hiba az értékelések lekérése során:', e);
      setRatingError('Nem sikerült betölteni az értékeléseket');
      setRatingSummary(null);
    }
  };

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
        
        localStorage.removeItem('token');
        setCurrentUserId(null);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (id) fetchRatings();
    
  }, [id, currentUserId]);

  const checkIsFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsFavorite(false);
      return;
    }

    try {
      const result = await axios.get(`http://localhost:3000/kedvencek/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(result?.data?.isFavorite ?? false);
    } catch (err) {
      console.error('Hiba a kedvenc állapot lekérése során:', err);
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    if (id && currentUserId) {
      checkIsFavorite();
    } else if (!currentUserId) {
      setIsFavorite(false);
    }
  }, [id, currentUserId]);

  const refreshKommentek = async () => {
    const result = await axios.get(`http://localhost:3000/kommentek/${id}`);
    setKommentek(Array.isArray(result.data) ? result.data : []);
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavoriteError('Kedvencek kezeléséhez be kell jelentkezni.');
      return;
    }

    try {
      setFavoriteLoading(true);
      setFavoriteError(null);

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:3000/kedvencek/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(
          'http://localhost:3000/kedvencek',
          { etterem_id: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Hiba a kedvenc kezelése során:', err);
      const msg = err?.response?.data?.error || 'Nem sikerült kezelni a kedvenvet';
      setFavoriteError(msg);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const renderStars = (value, onChange) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className='d-flex gap-1' aria-label='Csillagos értékelés'>
        {stars.map((s) => (
          <button
            key={s}
            type='button'
            className='btn btn-sm'
            onClick={() => onChange(s)}
            style={{
              padding: 0,
              lineHeight: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: s <= value ? '#f5c518' : '#c7c7c7'
            }}
            title={`${s} / 5`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingError(null);
    setRatingSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setRatingError('Értékeléshez be kell jelentkezni.');
      return;
    }
    if (![etelminoseg, kiszolgalas, hangulat].every((n) => Number(n) >= 1 && Number(n) <= 5)) {
      setRatingError('Minden kategóriát 1 és 5 között értékelj.');
      return;
    }

    try {
      setRatingLoading(true);
      await axios.post(
        'http://localhost:3000/ertekelesek',
        {
          etterem_id: Number(id),
          etelminoseg: Number(etelminoseg),
          kiszolgalas: Number(kiszolgalas),
          hangulat: Number(hangulat)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRatingSuccess('Értékelés elmentve.');
      await fetchRatings();
    } catch (err) {
      console.error('Hiba az értékelés mentése során:', err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem('token');
        setCurrentUserId(null);
        setRatingError('A bejelentkezés lejárt vagy érvénytelen. Jelentkezz be újra.');
        return;
      }

      const msg = err?.response?.data?.error || 'Nem sikerült elmenteni az értékelést';
      setRatingError(msg);
    } finally {
      setRatingLoading(false);
    }
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
      <div className='page-shell mt-4'>
        <div className='page-content'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <button className='piros' onClick={() => navigate('/restaurants')}>
              ← Vissza
            </button>
           
          </div>
          {favoriteError && <div className='text-danger mb-2'>{favoriteError}</div>}
          
          <div className='doboz'>
            <div className='row g-3'>
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
                 {currentUserId && (
                  <div className="d-flex justify-content-end mt-2">
                    <button 
                      className={`btn ${isFavorite ? 'btn-warning' : ' btn-outline-warning '}`}
                      onClick={handleFavoriteToggle}
                      disabled={favoriteLoading}
                      title={isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
                    >
                      {favoriteLoading ? '⛔...⛔' : (isFavorite ? ' ★ Kedvenc' : ' ☆ Kedvenc hozzáadása')}
                    </button>
                  </div>
            )}
              </div>
            </div>
          </div>

          {}
          <div className='dobozcomment mb-4'>
            <h5>Értékelés:</h5>

            {ratingSummary?.osszesitett && (
              <div className='mb-3'>
                <div className='d-flex flex-wrap gap-3'>
                  <div><strong>Átlag:</strong> {ratingSummary.osszesitett.atlag ?? '—'} ({ratingSummary.osszesitett.db ?? 0} db)</div>
                  <div><strong>Étel:</strong> {ratingSummary.osszesitett.etelminoseg ?? '—'}</div>
                  <div><strong>Kiszolgálás:</strong> {ratingSummary.osszesitett.kiszolgalas ?? '—'}</div>
                  <div><strong>Hangulat:</strong> {ratingSummary.osszesitett.hangulat ?? '—'}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleRatingSubmit}>
              <div className='mb-2'>
                <label className='form-label d-block'>Étel minőség</label>
                {renderStars(etelminoseg, setEtelminoseg)}
              </div>
              <div className='mb-2'>
                <label className='form-label d-block'>Kiszolgálás</label>
                {renderStars(kiszolgalas, setKiszolgalas)}
              </div>
              <div className='mb-3'>
                <label className='form-label d-block'>Hangulat</label>
                {renderStars(hangulat, setHangulat)}
              </div>

              {ratingError && <div className='text-danger mb-2'>{ratingError}</div>}
              {ratingSuccess && <div className='text-success mb-2'>{ratingSuccess}</div>}

              <button className='submit-gomb' type='submit' disabled={ratingLoading}>
                {ratingLoading ? 'Mentés...' : 'Értékelés mentése'}
              </button>
            </form>

            {ratingError == null && ratingSummary == null && (
              <div className='mt-2'>Értékelések betöltése...</div>
            )}
          </div>

          <div className=' dobozcomment mb-4'>
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

                    <button className='submit-gomb ' type='submit' disabled={kuldesLoading}>
                      {kuldesLoading ? 'Küldés...' : 'Küldés'}
                    </button>
                  </form>
                ) : (
                  <p className='feher'>Már írtál hozzászólást ehhez az étteremhez.</p>
                )}

                {kommentLoading ? (
                  <p>Betöltés...</p>
                ) : kommentError ? (
                  <p className='text-danger'>{kommentError}</p>
                ) : kommentek.length > 0 ? (
                  <ul className='list-group'>
                    {kommentek.map((komment) => (
                      <li key={komment.komment_id} className='list-group-item'>
                        <div className='comment-row'>
                          <div>
                            <p><strong>{komment.felhasznev}</strong> ({new Date(komment.letrehoz_ido).toLocaleDateString()}):</p>
                            <p>{komment.megjegyzes}</p>
                          </div>
                          {currentUserId != null && Number(komment.felhasznalo_id) === Number(currentUserId) && (
                            <button
                              className=' btn btn-sm btn-outline-danger'
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
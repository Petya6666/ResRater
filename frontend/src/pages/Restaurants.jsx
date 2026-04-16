import React from 'react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const DEFAULT_PAGE_SIZE = 9;
const MOBILE_PAGE_SIZE = 8;
const MOBILE_BREAKPOINT = 767.98;

const getPageSize = () => {
  if (typeof window === 'undefined') return DEFAULT_PAGE_SIZE;
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_PAGE_SIZE : DEFAULT_PAGE_SIZE;
};

const Restaurants = () => {
 const [ettermek,setettermek]=useState([]);
 const [query, setQuery] = useState('');
 const [loading, setLoading] = useState(false);
 const [kategoriak, setKategoriak] = useState([]);
 const [menuOpen, setMenuOpen] = useState(false);
 const [filters, setFilters] = useState({
  kategoria_id: '',
  min_atlag: '',
  max_atlag: ''
 });
 const [pageSize, setPageSize] = useState(getPageSize);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(0);
 const navigate = useNavigate();

 useEffect(() => {
  const handleResize = () => {
    const nextPageSize = getPageSize();
    setPageSize((prev) => (prev === nextPageSize ? prev : nextPageSize));
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
 }, []);

 useEffect(() => {
  const fetchKategoriak = async () => {
   try {
    const res = await axios.get('http://localhost:3000/ettermek/filters/kategoriak');
    setKategoriak(Array.isArray(res.data) ? res.data : []);
   } catch (e) {
    console.error('Hiba a kategóriák lekérése során:', e);
   }
  };
  fetchKategoriak();
 }, []);

 useEffect(() => {
  setCurrentPage(1);
 }, [query, filters.kategoria_id, filters.min_atlag, filters.max_atlag, pageSize]);

 useEffect(() => {
  const fetchEttermek = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query.trim().length > 0) params.q = query.trim();
      if (filters.kategoria_id) params.kategoria_id = filters.kategoria_id;
      if (filters.min_atlag) params.min_atlag = filters.min_atlag;
      if (filters.max_atlag) params.max_atlag = filters.max_atlag;
      params.page = currentPage;
      params.limit = pageSize;

      const result = await axios.get('http://localhost:3000/ettermek', { params });

      const payload = result.data;
      const rawEttermek = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);

      const updatedData = rawEttermek.map(etterem => ({
        ...etterem,
        url: typeof etterem.fajl_nev === 'string' && etterem.fajl_nev.startsWith('kepek/')
          ? `http://localhost:3000/${etterem.fajl_nev}`
          : `http://localhost:3000/kepek/${etterem.fajl_nev}`
      }));

      setettermek(updatedData);
      setTotalPages(Number.isInteger(payload?.totalPages) ? payload.totalPages : (updatedData.length > 0 ? 1 : 0));
    } catch (error) {
      console.error('Hiba az éttermek lekérése során:', error);
      setettermek([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const t = setTimeout(fetchEttermek, 300); 
  return () => clearTimeout(t);
}, [query, filters.kategoria_id, filters.min_atlag, filters.max_atlag, currentPage, pageSize]);

  const handleCardClick = (etterem) => {
    console.log('Clicked restaurant:', etterem); 
    navigate(`/restaurant/${etterem.etterem_id}`);
};

  const clearFilters = () => {
    setFilters({ kategoria_id: '', min_atlag: '', max_atlag: '' });
  };

  return (
    <>
      <Header />
      <div className='container mt-4'>
        <div className='restaurants-header mb-3'>
          <h2 className='mb-0 feher'>Éttermek</h2>

          <div className='restaurants-searchrow'>
            <input
              className='form-control restaurants-search'
              type='search'
              placeholder='Keresés (név vagy város)'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className='restaurants-filterwrap'>
              <button
                type='button'
                className='btn restaurants-filterbtn'
                onClick={() => setMenuOpen((v) => !v)}
              >
                Szűrő
              </button>

              {menuOpen && (
                <div className='restaurants-filtermenu'>
                  <div className='restaurants-filtergroup'>
                    <label className='restaurants-filterlabel'>Kategória</label>
                    <select
                      className='form-select restaurants-filtercontrol'
                      value={filters.kategoria_id}
                      onChange={(e) => setFilters((f) => ({ ...f, kategoria_id: e.target.value }))}
                    >
                      <option value=''>Összes</option>
                      {kategoriak.map((k) => (
                        <option key={k.kategoria_id} value={k.kategoria_id}>{k.kategoria_nev}</option>
                      ))}
                    </select>
                  </div>

                  <div className='restaurants-filtergroup'>
                    <label className='restaurants-filterlabel'>Értékelés</label>
                    <div className='restaurants-filterrow'>
                      <input
                        className='form-control restaurants-filtercontrol'
                        type='number'
                        min='0'
                        max='5'
                        step='0.1'
                        placeholder='min (0-5)'
                        value={filters.min_atlag}
                        onChange={(e) => setFilters((f) => ({ ...f, min_atlag: e.target.value }))}
                      />
                      <input
                        className='form-control restaurants-filtercontrol'
                        type='number'
                        min='0'
                        max='5'
                        step='0.1'
                        placeholder='max (0-5)'
                        value={filters.max_atlag}
                        onChange={(e) => setFilters((f) => ({ ...f, max_atlag: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className='restaurants-filteractions'>
                    <button type='button' className='btn btn-sm btn-outline-light' onClick={clearFilters}>Törlés</button>
                    <button type='button' className='btn btn-sm btn-light' onClick={() => setMenuOpen(false)}>OK</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && <p className='feher'>Keresés...</p>}
        {!loading && ettermek.length === 0 && <p className='feher'>Nincsenek éttermek...</p>}

        <div className='row'>
          {ettermek.map((etterem) => (
            <div key={etterem.etterem_id} className='col-12 col-sm-6 col-lg-4 mb-4'>
              <div 
                className='card h-100 restaurants-card' 
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
                  <p className='card-text'>Kategória: {etterem.kategoria_nev}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className='d-flex justify-content-center align-items-center gap-3 mt-2 mb-4'>
            <button
              type='button'
              className='bejelentkezes-gomb'
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Előző oldal
            </button>
            <span className='feher'>Oldal: {currentPage} / {totalPages}</span>
            <button
              type='button'
              className='bejelentkezes-gomb'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Következő oldal
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Restaurants;
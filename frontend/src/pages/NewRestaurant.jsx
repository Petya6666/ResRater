import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../styles/index.css";

const API_BASE = "http://localhost:3000";

const NewRestaurant = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nev: "",
    telefon: "",
    leiras: "",
    iranyitoszam: "",
    kategoria_id: ""
  });

  const [varosok, setVarosok] = useState([]);
  const [kategoriak, setKategoriak] = useState([]);

  // image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null); // e.g. 'kepek/xxx.png'
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const [loadingLists, setLoadingLists] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadLists = async () => {
      setLoadingLists(true);
      setError(null);
      try {
        const [varosRes, katRes] = await Promise.all([
          axios.get(`${API_BASE}/varosok`),
          axios.get(`${API_BASE}/kategoriak`)
        ]);
        setVarosok(Array.isArray(varosRes.data) ? varosRes.data : []);
        setKategoriak(Array.isArray(katRes.data) ? katRes.data : []);
      } catch (e) {
        console.error("Hiba a listák betöltése során:", e);
        setError("Nem sikerült betölteni a város/kategória listát.");
      } finally {
        setLoadingLists(false);
      }
    };

    loadLists();
  }, [navigate]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectedVarosLabel = useMemo(() => {
    const zip = Number.parseInt(form.iranyitoszam, 10);
    if (!Number.isInteger(zip)) return null;
    const found = varosok.find((v) => Number(v.iranyitoszam) === zip);
    return found ? `${found.varos} (${found.iranyitoszam})` : null;
  }, [form.iranyitoszam, varosok]);

  const validate = () => {
    if (!form.nev.trim()) return "A név kötelező.";
    if (!form.telefon.trim()) return "A telefonszám kötelező.";
    if (!form.iranyitoszam) return "Az irányítószám kötelező.";
    const zip = Number.parseInt(form.iranyitoszam, 10);
    if (!Number.isInteger(zip) || zip < 1000 || zip > 9999) return "Érvénytelen irányítószám.";
    if (form.leiras && form.leiras.length > 2000) return "A leírás max. 2000 karakter.";

    if (imageFile) {
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(imageFile.type)) return "Csak PNG/JPG/WEBP képfájl tölthető fel.";
      if (imageFile.size > 5 * 1024 * 1024) return "A kép max. 5MB lehet.";
    }

    return null;
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return null;
    if (uploadedImagePath) return uploadedImagePath;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }

    setImageUploading(true);
    setImageError(null);

    try {
      const fd = new FormData();
      fd.append("image", imageFile);

      const res = await axios.post(`${API_BASE}/kepek/upload`, fd, {
        headers: {
          Authorization: `Bearer ${token}`
          // do not set Content-Type; browser will set multipart boundary
        }
      });

      const pathFromServer = res?.data?.fajl_nev;
      if (!pathFromServer) throw new Error("Nincs fajl_nev a válaszban.");

      setUploadedImagePath(pathFromServer);
      return pathFromServer;
    } catch (e) {
      console.error("Képfeltöltési hiba:", e);
      const msg = e?.response?.data?.error || e?.message || "Nem sikerült feltölteni a képet.";
      setImageError(msg);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitLoading(true);

      // 1) upload image first (optional)
      const kepFajlNev = await uploadImageIfNeeded();
      if (imageFile && !kepFajlNev) {
        setError("A kép feltöltése nem sikerült. Próbáld újra.");
        return;
      }

      // 2) create restaurant
      const payload = {
        nev: form.nev.trim(),
        telefon: form.telefon.trim(),
        leiras: form.leiras.trim(),
        iranyitoszam: Number.parseInt(form.iranyitoszam, 10),
        kategoria_id: form.kategoria_id ? Number.parseInt(form.kategoria_id, 10) : null,
        kepFajlNev
      };

      const res = await axios.post(`${API_BASE}/ettermek`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setSuccess(res?.data?.message ?? "Étterem létrehozva.");

      const newId = res?.data?.etterem_id;
      if (newId) navigate(`/restaurant/${newId}`);
    } catch (err) {
      console.error("Hiba az étterem létrehozása során:", err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        setError("A bejelentkezés lejárt vagy érvénytelen. Jelentkezz be újra.");
        navigate("/login");
        return;
      }

      const msg = err?.response?.data?.error || "Nem sikerült létrehozni az éttermet.";
      setError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const uploadedImageUrl = uploadedImagePath ? `${API_BASE}/${uploadedImagePath}` : null;

  return (
    <>
      <Header />
      <div className='container mt-4 d-flex justify-content-center'>
        <div style={{ maxWidth: "900px", width: "100%" }}>
          <button className='piros mb-3 ' onClick={() => navigate("/restaurants")}>← Vissza</button>

          <div className='doboz'>
            <h2 className='mb-3'>Új étterem hozzáadása</h2>

            {loadingLists ? (
              <p>Betöltés...</p>
            ) : (
              <form onSubmit={onSubmit}>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='mb-3'>
                      <label className='form-label' htmlFor='nev'>Név *</label>
                      <input
                        id='nev'
                        name='nev'
                        className='form-control'
                        value={form.nev}
                        onChange={onChange}
                        autoComplete='off'
                        required
                      />
                    </div>

                    <div className='mb-3'>
                      <label className='form-label' htmlFor='telefon'>Telefonszám *</label>
                      <input
                        id='telefon'
                        name='telefon'
                        className='form-control'
                        value={form.telefon}
                        onChange={onChange}
                        autoComplete='off'
                        required
                      />
                    </div>

                    <div className='mb-3'>
                      <label className='form-label' htmlFor='iranyitoszam'>Város (irányítószám) *</label>
                      <select
                        id='iranyitoszam'
                        name='iranyitoszam'
                        className='form-select'
                        value={form.iranyitoszam}
                        onChange={onChange}
                        required
                      >
                        <option value=''>Válassz...</option>
                        {varosok.map((v) => (
                          <option key={v.iranyitoszam} value={v.iranyitoszam}>
                            {v.varos} ({v.iranyitoszam})
                          </option>
                        ))}
                      </select>
                      {selectedVarosLabel && (
                        <div className='form-text'>Kiválasztva: {selectedVarosLabel}</div>
                      )}
                    </div>

                    <div className='mb-3'>
                      <label className='form-label' htmlFor='kategoria_id'>Kategória</label>
                      <select
                        id='kategoria_id'
                        name='kategoria_id'
                        className='form-select'
                        value={form.kategoria_id}
                        onChange={onChange}
                      >
                        <option value=''>—</option>
                        {kategoriak.map((k) => (
                          <option key={k.kategoria_id} value={k.kategoria_id}>
                            {k.kategoria_nev}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='mb-3'>
                      <label className='form-label' htmlFor='leiras'>Leírás</label>
                      <textarea
                        id='leiras'
                        name='leiras'
                        className='form-control'
                        rows={6}
                        value={form.leiras}
                        onChange={onChange}
                        maxLength={2000}
                        placeholder='(opcionális)'
                      />
                      <div className='form-text'>{form.leiras.length} / 2000</div>
                    </div>

                    <div className='mb-3'>
                      <label className='form-label' htmlFor='image'>Kép feltöltése</label>
                      <input
                        id='image'
                        name='image'
                        className='form-control'
                        type='file'
                        accept='image/png,image/jpeg,image/webp'
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setImageFile(f);
                          setUploadedImagePath(null);
                          setImageError(null);
                        }}
                      />
                      <div className='form-text'>PNG/JPG/WEBP, max. 5MB</div>

                      {imageError && <div className='text-danger mt-2'>{imageError}</div>}

                      {(imagePreviewUrl || uploadedImageUrl) && (
                        <div className='mt-3'>
                          <div className='mb-2'>Előnézet:</div>
                          <img
                            src={uploadedImageUrl || imagePreviewUrl}
                            alt='Feltöltött kép előnézet'
                            className='img-fluid rounded'
                            style={{ width: '100%', maxHeight: 240, objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      {imageUploading && <div className='mt-2'>Kép feltöltése...</div>}
                    </div>
                  </div>
                </div>

                {error && <div className='alert alert-danger'>{error}</div>}
                {success && <div className='alert alert-success'>{success}</div>}

                <button
                  className='submit-gomb'
                  type='submit'
                  disabled={submitLoading || imageUploading}
                >
                  {submitLoading ? "Mentés..." : "Étterem létrehozása"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewRestaurant;










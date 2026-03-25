const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const port = 3000;
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'very_secret_key'; // move to .env later
const cors = require('cors');
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/kepek', express.static('uploads'));

// Multer beállítás képek feltöltéséhez
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeBase = path
            .basename(file.originalname || 'image', ext)
            .replace(/[^a-z0-9-_]/gi, '_')
            .slice(0, 60);
        cb(null, `${Date.now()}_${safeBase}${ext || '.png'}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        if (allowed.includes(file.mimetype)) return cb(null, true);
        return cb(new Error('Csak PNG/JPG/WEBP képfájl engedélyezett.'));
    }
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resrater_db',
    port: 3307
});


app.get('/', (req, res) => {
    res.send('Welcome to ResRater API');
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result) 
        })
});

//(teszt célokra) összes felhasználó lekérése
app.get('/users', (req, res) => {
    const sql = "SELECT felhasznalo_id, felhasznev FROM felhasznalok;";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Hiba a lekérdezés során: ", err);
            return res.status(500).json({ error: 'Adatbázis hiba történt a lekérdezéskor.' });
        }
        res.json(result);
    });
});



//étteremkereső oldal api
app.get('/browserettermek', (req, res) => {
    // One row / restaurant (avoid duplicates from multiple ratings/images)
    const sql = `
        SELECT
            e.etterem_id,
            e.nev,
            e.iranyitoszam,
            v.varos,
            ROUND(AVG(er.atlag), 2) AS atlag,
            MIN(k.fajl_nev) AS fajl_nev
        FROM ettermek e
        INNER JOIN varosok v ON e.iranyitoszam = v.iranyitoszam
        LEFT JOIN ertekelesek er ON e.etterem_id = er.etterem_id
        LEFT JOIN kepek k ON e.etterem_id = k.etterem_id
        GROUP BY e.etterem_id, e.nev, e.iranyitoszam, v.varos
    `;
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result)
    });
});

// Restaurant search (name/city)
// GET /ettermek/search?q=...
app.get('/ettermek/search', (req, res) => {
    const q = (req.query.q ?? '').toString().trim();

    // If no query provided, return the full list (same as /browserettermek)
    const baseSql = `
        SELECT
            e.etterem_id,
            e.nev,
            e.iranyitoszam,
            v.varos,
            ROUND(AVG(er.atlag), 2) AS atlag,
            MIN(k.fajl_nev) AS fajl_nev
        FROM ettermek e
        INNER JOIN varosok v ON e.iranyitoszam = v.iranyitoszam
        LEFT JOIN ertekelesek er ON e.etterem_id = er.etterem_id
        LEFT JOIN kepek k ON e.etterem_id = k.etterem_id
    `;

    const whereSql = q.length > 0 ? `WHERE (e.nev LIKE ? OR v.varos LIKE ?)` : '';

    const groupSql = `
        GROUP BY e.etterem_id, e.nev, e.iranyitoszam, v.varos
        ORDER BY e.nev ASC
    `;

    const sql = `${baseSql}\n${whereSql}\n${groupSql}`;

    const like = `%${q}%`;
    const params = q.length > 0 ? [like, like] : [];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(result);
    });
});

//egy adott étterem minden adatának lekérése
app.get('/etterem/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT ettermek.etterem_id, ettermek.nev, ettermek.telefon, ettermek.leiras, kategoriak.kategoria_nev as kategoria, ettermek.iranyitoszam, varosok.varos, kepek.fajl_nev FROM ettermek INNER JOIN varosok ON ettermek.iranyitoszam = varosok.iranyitoszam INNER JOIN kepek ON ettermek.etterem_id = kepek.etterem_id LEFT JOIN kategoriak ON ettermek.kategoria_id = kategoriak.kategoria_id WHERE ettermek.etterem_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Etterem not found' });
        }

        console.log('Sending restaurant data:', result[0]);
        return res.json(result[0]); 
    });
});

//egy adott étterem értékelésének lekérése
app.get('/ertekeles/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT ettermek.etterem_id, ertekelesek.atlag, ertekelesek.etelminoseg, ertekelesek.kiszolgalas, ertekelesek.hangulat FROM ettermek INNER JOIN ertekelesek ON ettermek.etterem_id = ertekelesek.etterem_id WHERE ettermek.etterem_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Etterem not found' });
        }

        return res.json(result[0]); 
    });
});

// Értékelés összesítés + saját értékelés lekérése (ha be van jelentkezve)
app.get('/ertekelesek/osszefoglalo/:etteremId', (req, res) => {
    const { etteremId } = req.params;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded?.id ?? null;
        } catch {
            return null;
        }
    };

    const userId = getUserIdFromToken();

    const aggSql = `
        SELECT
            ROUND(AVG(atlag), 2) AS atlag,
            ROUND(AVG(etelminoseg), 2) AS etelminoseg,
            ROUND(AVG(kiszolgalas), 2) AS kiszolgalas,
            ROUND(AVG(hangulat), 2) AS hangulat,
            COUNT(*) AS db
        FROM ertekelesek
        WHERE etterem_id = ?
    `;

    db.query(aggSql, [etteremId], (aggErr, aggRows) => {
        if (aggErr) {
            console.error('Database error:', aggErr);
            return res.status(500).json({ error: aggErr.message });
        }

        const agg = aggRows?.[0] ?? { atlag: null, etelminoseg: null, kiszolgalas: null, hangulat: null, db: 0 };

        if (!userId) {
            return res.json({ osszesitett: agg, sajat: null });
        }

        const ownSql = `
            SELECT ertekeles_id, etelminoseg, kiszolgalas, hangulat, atlag, datum
            FROM ertekelesek
            WHERE etterem_id = ? AND felhasznalo_id = ?
            ORDER BY datum DESC
            LIMIT 1
        `;
        db.query(ownSql, [etteremId, userId], (ownErr, ownRows) => {
            if (ownErr) {
                console.error('Database error:', ownErr);
                return res.status(500).json({ error: ownErr.message });
            }
            return res.json({ osszesitett: agg, sajat: ownRows?.[0] ?? null });
        });
    });
});

// Saját értékelés mentése (új vagy módosítás)
app.post('/ertekelesek', authenticateToken, (req, res) => {
    const { etterem_id, etelminoseg, kiszolgalas, hangulat } = req.body;

    const toInt = (v) => Number.parseInt(v, 10);
    const e = toInt(etelminoseg);
    const k = toInt(kiszolgalas);
    const h = toInt(hangulat);

    if (!etterem_id) return res.status(400).json({ error: 'Étterem azonosító kötelező.' });
    if (![e, k, h].every((n) => Number.isInteger(n) && n >= 1 && n <= 5)) {
        return res.status(400).json({ error: 'Minden értékelés 1 és 5 közötti egész szám kell legyen.' });
    }

    const atlag = Number(((e + k + h) / 3).toFixed(2));

    const checkSql = 'SELECT ertekeles_id FROM ertekelesek WHERE etterem_id = ? AND felhasznalo_id = ? LIMIT 1';
    db.query(checkSql, [etterem_id, req.user.id], (checkErr, rows) => {
        if (checkErr) {
            console.error('Database error:', checkErr);
            return res.status(500).json({ error: checkErr.message });
        }

        if (rows && rows.length > 0) {
            const updateSql = `
                UPDATE ertekelesek
                SET etelminoseg = ?, kiszolgalas = ?, hangulat = ?, atlag = ?, datum = NOW()
                WHERE ertekeles_id = ?
            `;
            return db.query(updateSql, [e, k, h, atlag, rows[0].ertekeles_id], (uErr) => {
                if (uErr) {
                    console.error('Database error:', uErr);
                    return res.status(500).json({ error: uErr.message });
                }
                return res.json({ message: 'Értékelés frissítve.', atlag });
            });
        }

        const insertSql = `
            INSERT INTO ertekelesek (etterem_id, felhasznalo_id, atlag, datum, etelminoseg, kiszolgalas, hangulat)
            VALUES (?, ?, ?, NOW(), ?, ?, ?)
        `;
        db.query(insertSql, [etterem_id, req.user.id, atlag, e, k, h], (iErr, result) => {
            if (iErr) {
                console.error('Database error:', iErr);
                return res.status(500).json({ error: iErr.message });
            }
            return res.status(201).json({ message: 'Értékelés mentve.', ertekeles_id: result.insertId, atlag });
        });
    });
});

//egy adott étterem kommentjeinek lekérése
app.get('/kommentek/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT kommentek.komment_id, ettermek.etterem_id, kommentek.felhasznalo_id, felhasznalok.felhasznev, kommentek.megjegyzes, kommentek.letrehoz_ido FROM kommentek INNER JOIN felhasznalok ON kommentek.felhasznalo_id = felhasznalok.felhasznalo_id INNER JOIN ettermek ON kommentek.etterem_id = ettermek.etterem_id WHERE ettermek.etterem_id = ? ORDER BY kommentek.letrehoz_ido DESC;';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        return res.json(result);
    });
});

// új komment létrehozása (bejelentkezett felhasználó)
app.post('/kommentek', authenticateToken, (req, res) => {
    const { etterem_id, megjegyzes } = req.body;

    if (!etterem_id || !megjegyzes || typeof megjegyzes !== 'string' || megjegyzes.trim().length === 0) {
        return res.status(400).json({ error: 'Étterem azonosító és megjegyzés kötelező.' });
    }

    const checkSql = 'SELECT komment_id FROM kommentek WHERE etterem_id = ? AND felhasznalo_id = ? LIMIT 1';
    db.query(checkSql, [etterem_id, req.user.id], (checkErr, rows) => {
        if (checkErr) {
            console.error('Database error:', checkErr);
            return res.status(500).json({ error: checkErr.message });
        }

        if (rows && rows.length > 0) {
            return res.status(409).json({ error: 'Már írtál hozzászólást ehhez az étteremhez.' });
        }

        const sql = 'INSERT INTO kommentek (etterem_id, felhasznalo_id, megjegyzes) VALUES (?, ?, ?)';

        db.query(sql, [etterem_id, req.user.id, megjegyzes.trim()], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: err.message });
            }

            return res.status(201).json({
                message: 'Komment létrehozva.',
                komment_id: result.insertId
            });
        });
    });
});

// komment törlése (csak a saját kommentje)
app.delete('/kommentek/:kommentId', authenticateToken, (req, res) => {
    const { kommentId } = req.params;

    const selectSql = 'SELECT komment_id, felhasznalo_id FROM kommentek WHERE komment_id = ? LIMIT 1';
    db.query(selectSql, [kommentId], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Komment nem található.' });
        }

        const komment = rows[0];
        if (Number(komment.felhasznalo_id) !== Number(req.user.id)) {
            return res.status(403).json({ error: 'Nincs jogosultságod törölni ezt a kommentet.' });
        }

        const deleteSql = 'DELETE FROM kommentek WHERE komment_id = ?';
        db.query(deleteSql, [kommentId], (delErr, delResult) => {
            if (delErr) {
                console.error('Database error:', delErr);
                return res.status(500).json({ error: delErr.message });
            }

            if (!delResult || delResult.affectedRows === 0) {
                return res.status(404).json({ error: 'Komment nem található.' });
            }

            return res.json({ message: 'Komment törölve.' });
        });
    });
});

//felhasználói regisztráció
app.post('/register', async (req, res) => {
    const { felhasznev, email, jelszo } = req.body;

    if (!felhasznev || !email || !jelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    try {
        const checkSql = 'SELECT felhasznev, email FROM felhasznalok WHERE felhasznev = ? OR email = ?';
        db.query(checkSql, [felhasznev, email], async (err, result) => {
            if (err) {
                console.error('Hiba az ellenőrzés során:', err);
                return res.status(500).json({ error: 'Adatbázis hiba történt.' });
            }

            if (result.length > 0) {
                return res.status(400).json({ error: 'A felhasználónév vagy email már létezik!' });
            }

            const hashedPassword = await bcrypt.hash(jelszo, 10);

            const sql = `
                INSERT INTO felhasznalok (felhasznev, email, jelszo)
                VALUES (?, ?, ?)
            `;

            db.query(sql, [felhasznev, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Hiba a regisztráció során:', err);
                    return res.status(500).json({ error: 'Adatbázis hiba történt.' });
                }

                res.status(201).json({
                    message: 'Sikeres regisztráció!',
                    felhasznalo_id: result.insertId,
                    szerep: 'felhasznalo'
                });
            });
        });
    } catch (error) {
        console.error('Szerver hiba:', error);
        res.status(500).json({ error: 'Szerver hiba történt.' });
    }
});

//felhasznalonev modositasa
app.patch('/users/:id/username', (req, res) => {
    const { id } = req.params;
    const { felhasznev } = req.body;

    if (!felhasznev) {
        return res.status(400).json({ error: 'Felhasználónév kötelező!' });
    }

    const sql = 'UPDATE felhasznalok SET felhasznev = ? WHERE felhasznalo_id = ?';

    db.query(sql, [felhasznev, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Adatbázis hiba.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található.' });
        }

        res.json({
            message: 'Felhasználónév sikeresen frissítve.',
            felhasznev
        });
    });
});

//jelszo modositasa
app.patch('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { regiJelszo, ujJelszo } = req.body;

    if (!regiJelszo || !ujJelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    const getUserSql = 'SELECT jelszo FROM felhasznalok WHERE felhasznalo_id = ?';

    db.query(getUserSql, [id], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Adatbázis hiba.' });

        if (result.length === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található.' });
        }

        const storedHash = result[0].jelszo;
        const match = await bcrypt.compare(regiJelszo, storedHash);

        if (!match) {
            return res.status(401).json({ error: 'Hibás régi jelszó.' });
        }

        const newHashedPassword = await bcrypt.hash(ujJelszo, 10);
        const updateSql = 'UPDATE felhasznalok SET jelszo = ? WHERE felhasznalo_id = ?';

        db.query(updateSql, [newHashedPassword, id], (err) => {
            if (err) return res.status(500).json({ error: 'Adatbázis hiba.' });

            res.json({ message: 'Jelszó sikeresen megváltoztatva.' });
        });
    });
});

//felhasználói bejelentkezés
app.post('/login', (req, res) => {
    const { azonosito, email, jelszo } = req.body;
    const loginValue = azonosito || email;

    if (!loginValue || !jelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    const sql = `
        SELECT felhasznalo_id, felhasznev, jelszo
        FROM felhasznalok
        WHERE email = ? OR felhasznev = ?
        LIMIT 1
    `;

    db.query(sql, [loginValue, loginValue], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Adatbázis hiba.' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Hibás belépési adatok.' });
        }

        try {
            const user = result[0];
            const match = await bcrypt.compare(jelszo, user.jelszo);

            if (!match) {
                return res.status(401).json({ error: 'Hibás belépési adatok.' });
            }

            const token = jwt.sign(
                {
                    id: user.felhasznalo_id,
                    felhasznev: user.felhasznev
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                message: 'Sikeres bejelentkezés!',
                token,
                user: {
                    id: user.felhasznalo_id,
                    felhasznev: user.felhasznev
                }
            });

        } catch (e) {
            console.error('BCRYPT ERROR:', e);
            return res.status(500).json({ error: 'Bcrypt hiba.' });
        }
    });
});

// get current user from token
app.get('/me', authenticateToken, (req, res) => {
    res.json({
        id: req.user.id,
        felhasznev: req.user.felhasznev
    });
});

//  Segéd endpointok az új étterem űrlaphoz 
// Városok listája (irányítószám + város)
app.get('/varosok', (req, res) => {
    const sql = 'SELECT iranyitoszam, varos FROM varosok ORDER BY varos ASC';
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(rows);
    });
});

// Kategóriák listája
app.get('/kategoriak', (req, res) => {
    const sql = 'SELECT kategoria_id, kategoria_nev FROM kategoriak ORDER BY kategoria_nev ASC';
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(rows);
    });
});

// Kép feltöltés (bejelentkezést igényel)
app.post('/kepek/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nincs feltöltött fájl.' });

    // egységesen úgy tároljuk, ahogy az app többi része is kezeli
    const filePath = `kepek/${req.file.filename}`;
    return res.status(201).json({ message: 'Kép feltöltve.', fajl_nev: filePath });
});

//  Új étterem létrehozása (bejelentkezés kell hozzá) 
// body: { nev, telefon, leiras, iranyitoszam, kategoria_id?, kepFajlNev? }
app.post('/ettermek', authenticateToken, (req, res) => {
    const { nev, telefon, leiras, iranyitoszam, kategoria_id, kepFajlNev } = req.body;

    if (!nev || typeof nev !== 'string' || nev.trim().length < 2) {
        return res.status(400).json({ error: 'Az étterem neve kötelező (min. 2 karakter).' });
    }

    if (!telefon || typeof telefon !== 'string' || telefon.trim().length < 5) {
        return res.status(400).json({ error: 'Telefonszám kötelező.' });
    }

    const zip = Number.parseInt(iranyitoszam, 10);
    if (!Number.isInteger(zip) || zip < 1000 || zip > 9999) {
        return res.status(400).json({ error: 'Érvénytelen irányítószám.' });
    }

    const katId = (kategoria_id === null || kategoria_id === undefined || kategoria_id === '')
        ? null
        : Number.parseInt(kategoria_id, 10);

    if (katId !== null && !Number.isInteger(katId)) {
        return res.status(400).json({ error: 'Érvénytelen kategória.' });
    }

    const desc = (typeof leiras === 'string' ? leiras.trim() : '').slice(0, 2000);

    // 1) város létezés ellenőrzése
    db.query('SELECT iranyitoszam FROM varosok WHERE iranyitoszam = ? LIMIT 1', [zip], (zipErr, zipRows) => {
        if (zipErr) {
            console.error('Database error:', zipErr);
            return res.status(500).json({ error: zipErr.message });
        }
        if (!zipRows || zipRows.length === 0) {
            return res.status(400).json({ error: 'Ismeretlen irányítószám (nincs a varosok táblában).' });
        }

        // 2) étterem beszúrás
        const insertSql = `
            INSERT INTO ettermek (nev, telefon, leiras, iranyitoszam, kategoria_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertSql, [nev.trim(), telefon.trim(), desc.length ? desc : null, zip, katId], (insErr, insResult) => {
            if (insErr) {
                console.error('Database error:', insErr);
                return res.status(500).json({ error: insErr.message });
            }

            const etteremId = insResult.insertId;

            // 3) opcionális kép rögzítése
            // kepFajlNev érkezhet pl. 'kepek/valami.png' formában a /kepek/upload válaszából
            if (kepFajlNev && typeof kepFajlNev === 'string' && kepFajlNev.trim().length > 0) {
                const fileName = kepFajlNev.trim().startsWith('kepek/') ? kepFajlNev.trim() : `kepek/${kepFajlNev.trim()}`;
                const kepSql = 'INSERT INTO kepek (etterem_id, fajl_nev) VALUES (?, ?)';
                return db.query(kepSql, [etteremId, fileName], (kErr) => {
                    if (kErr) {
                        console.error('Database error:', kErr);
                        return res.status(201).json({ message: 'Étterem létrehozva, de a kép mentése nem sikerült.', etterem_id: etteremId });
                    }
                    return res.status(201).json({ message: 'Étterem sikeresen létrehozva.', etterem_id: etteremId });
                });
            }

            return res.status(201).json({ message: 'Étterem sikeresen létrehozva.', etterem_id: etteremId });
        });
    });
});

// Kategória lista a szűrőhöz (id + név)
app.get('/ettermek/filters/kategoriak', (req, res) => {
    const sql = 'SELECT kategoria_id, kategoria_nev FROM kategoriak ORDER BY kategoria_nev ASC';
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(rows);
    });
});

// Éttermek listázása szűrőkkel
// GET /ettermek?q=&kategoria_id=&min_atlag=&max_atlag=
app.get('/ettermek', (req, res) => {
    const q = (req.query.q ?? '').toString().trim();

    const katRaw = (req.query.kategoria_id ?? '').toString().trim();
    const kategoriaId = katRaw.length ? Number.parseInt(katRaw, 10) : null;

    const minRaw = (req.query.min_atlag ?? '').toString().trim();
    const maxRaw = (req.query.max_atlag ?? '').toString().trim();
    const minAtlag = minRaw.length ? Number.parseFloat(minRaw) : null;
    const maxAtlag = maxRaw.length ? Number.parseFloat(maxRaw) : null;

    if (kategoriaId !== null && !Number.isInteger(kategoriaId)) {
        return res.status(400).json({ error: 'Érvénytelen kategoria_id.' });
    }
    if (minAtlag !== null && (Number.isNaN(minAtlag) || minAtlag < 0 || minAtlag > 5)) {
        return res.status(400).json({ error: 'Érvénytelen min_atlag (0-5).' });
    }
    if (maxAtlag !== null && (Number.isNaN(maxAtlag) || maxAtlag < 0 || maxAtlag > 5)) {
        return res.status(400).json({ error: 'Érvénytelen max_atlag (0-5).' });
    }

    const baseSql = `
        SELECT
            e.etterem_id,
            e.nev,
            e.iranyitoszam,
            v.varos,
            ROUND(AVG(er.atlag), 2) AS atlag,
            MIN(k.fajl_nev) AS fajl_nev,
            e.kategoria_id
        FROM ettermek e
        INNER JOIN varosok v ON e.iranyitoszam = v.iranyitoszam
        LEFT JOIN ertekelesek er ON e.etterem_id = er.etterem_id
        LEFT JOIN kepek k ON e.etterem_id = k.etterem_id
    `;

    const where = [];
    const params = [];

    if (q.length > 0) {
        where.push('(e.nev LIKE ? OR v.varos LIKE ?)');
        const like = `%${q}%`;
        params.push(like, like);
    }

    if (kategoriaId !== null) {
        where.push('e.kategoria_id = ?');
        params.push(kategoriaId);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // min/max átlagot HAVING-ban kell szűrni, mert aggregált mező
    const having = [];
    if (minAtlag !== null) {
        having.push('AVG(er.atlag) >= ?');
        params.push(minAtlag);
    }
    if (maxAtlag !== null) {
        having.push('AVG(er.atlag) <= ?');
        params.push(maxAtlag);
    }

    // Ha nincs értékelés, AVG = NULL. Min/max szűrés esetén ezeket alapból kizárjuk.
    const havingSql = having.length ? `HAVING ${having.join(' AND ')}` : '';

    const sql = `
        ${baseSql}
        ${whereSql}
        GROUP BY e.etterem_id, e.nev, e.iranyitoszam, v.varos, e.kategoria_id
        ${havingSql}
        ORDER BY e.nev ASC
    `;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(result);
    });
});

//middleware a token ellenőrzésére
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

//védelem alatt álló profil oldal
app.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

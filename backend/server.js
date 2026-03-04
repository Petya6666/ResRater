const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const port = 3000;
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'very_secret_key'; // move to .env later
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/kepek', express.static('uploads'));

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
    const sql = 'SELECT ettermek.etterem_id, ettermek.nev, ettermek.iranyitoszam, varosok.varos, ertekelesek.atlag, kepek.fajl_nev FROM ettermek INNER JOIN kepek ON ettermek.etterem_id = kepek.etterem_id INNER JOIN ertekelesek ON ettermek.etterem_id = ertekelesek.etterem_id INNER JOIN varosok ON ettermek.iranyitoszam = varosok.iranyitoszam;';
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result)
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

const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const port = 3000;
const mysql = require('mysql2');
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resrater_db',
    port: 3307
});

//teszt
/*
db.connect(err => {
    if (err) {
        console.error('Adatbázis kapcsolat hiba:', err);
        return;
    }
    console.log('Sikeresen kapcsolódva az adatbázishoz.');
});
*/

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
    const sql = 'SELECT ettermek.nev, ettermek.varos, ettermek.kategoria ,ettermek.atlag_ertekeles FROM ettermek;';
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result)
    });
});

//egy adott étterem minden adatának lekérése
app.get('/etterem/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM ettermek WHERE etterem_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Etterem not found' });
        }

        return res.json(result[0]); 
    });
});



//felhasználói regisztráció
app.post('/register', async (req, res) => {
    const { felhasznev, email, jelszo } = req.body;

    if (!felhasznev || !email || !jelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    try {
        // Jelszó titkosítása
        const hashedPassword = await bcrypt.hash(jelszo, 10);

        // Az adatbázis automatikusan beállítja a "felhasznalo" szerepet
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
    } catch (error) {
        console.error('Szerver hiba:', error);
        res.status(500).json({ error: 'Szerver hiba történt.' });
    }
});


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

        res.json({ message: 'Felhasználónév sikeresen frissítve.' });
    });
});


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

/* 

app.patch('/users/me/password', authenticateToken, async (req, res) => {
    const userId = req.user.id; // JWT-ből
    const { regiJelszo, ujJelszo } = req.body;

    if (!regiJelszo || !ujJelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    const getUserSql = 'SELECT jelszo FROM felhasznalok WHERE felhasznalo_id = ?';

    db.query(getUserSql, [userId], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Adatbázis hiba.' });

        const storedHash = result[0].jelszo;
        const match = await bcrypt.compare(regiJelszo, storedHash);

        if (!match) {
            return res.status(401).json({ error: 'Hibás régi jelszó.' });
        }

        const newHashedPassword = await bcrypt.hash(ujJelszo, 10);
        const updateSql = 'UPDATE felhasznalok SET jelszo = ? WHERE felhasznalo_id = ?';

        db.query(updateSql, [newHashedPassword, userId], (err) => {
            if (err) return res.status(500).json({ error: 'Adatbázis hiba.' });

            res.json({ message: 'Jelszó sikeresen megváltoztatva.' });
        });
    });
});


*/



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

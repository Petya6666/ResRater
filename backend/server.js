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



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

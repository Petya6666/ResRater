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

app.get('/kommentek', (req, res) => {
    const id = req.params.id;
    const sql = 'under construction';

    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);


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
                token
            });

        } catch (e) {
            console.error('BCRYPT ERROR:', e);
            return res.status(500).json({ error: 'Bcrypt hiba.' });
        }
    });
});



/* frontend login dolog
fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'test@test.hu',
        jelszo: '123456'
    })
})
.then(res => res.json())
.then(data => {
    localStorage.setItem('token', data.token);
});

*/ 

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


app.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

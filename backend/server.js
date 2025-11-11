const express = require('express');
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

app.get('/', (req, res) => {
    res.send('Welcome to ResRater API');
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result) 
        })
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
app.get('/etterem', (req, res) => {
    const sql = 'SELECT * FROM ettermek';
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result) 
    });
});



//(teszt célokra) felhasználók lekérése (még nem működik)
app.get('/api/users', async (req, res) => {
    try {
        const sqlQuery = "SELECT id, name, email, created_at FROM users";
        const [rows] = await dbPool.query(sqlQuery);
        res.json(rows);
    } catch (error) {
        console.error("Hiba a lekérdezés során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a lekérdezéskor.' });
    }
});

// CREATE (POST): Új felhasználó hozzáadása (még nem működik)
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
        const [result] = await dbPool.query(sql, [name, email]);
        res.status(201).json({ message: "Felhasználó sikeresen hozzáadva", id: result.insertId });
    } catch (error) {
        console.error("Hiba a beszúrás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a beszúráskor.' });
    }
});


// UPDATE (PATCH): Felhasználó adatainak módosítása ID alapján (még nem működik)
app.patch('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'A név és az email mező kitöltése kötelező a módosításhoz.' });
        }

        const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        const [result] = await dbPool.query(sql, [name, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található.' });
        }
        res.json({ message: "Felhasználó sikeresen módosítva", id: id });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

// DELETE (DELETE): Felhasználó törlése ID alapján (még nem működik)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM users WHERE id = ?";
        const [result] = await dbPool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található.' });
        }
        res.json({ message: "Felhasználó sikeresen törölve", id: id });
    } catch (error) {
        console.error("Hiba a törlés során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a törléskor.' });
    }
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

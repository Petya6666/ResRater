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


app.get('/ettermek', (req, res) => {
    const sql = 'SELECT * FROM ettermek';
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result) 
    });
});

app.get('/komplikacio', (req, res) => {
    const sql = 'SELECT ettermek.nev AS "etteremnev", kategoriak.nev AS "kategorianev" FROM ettermek INNER JOIN kategoriak ON ettermek.kategoria_id = kategoriak.kategoria_id';
    db.query(sql, (err, result) => {
        if (err) return res.json(err); 
        return res.json(result) 
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

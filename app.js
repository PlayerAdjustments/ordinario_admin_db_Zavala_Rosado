require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database when the application starts
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

//obtains data from any table
function getAllData(tabla, res) {
    const query = `SELECT * FROM ${tabla};`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Couldn't execute query: ", err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        
        res.json(results);
    });
}

//? Maestros endpoints
app.get('/api/maestros', (req, res) => {
    connection.query('SELECT * FROM maestros;', (err, results) => {
        if (err) {
            console.error("Couldn't execute query: ", err);
            res.status(500).json({ error: 'Database query failed' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/maestros', (req, res) => {
    console.log(req.body.name);
    res.end();
});

//? Materias endpoints
app.get('/api/asignaturas', (req, res) => {
    getAllData('materias', res)
})

//? Estudiantes endpoints
app.get('/api/estudiantes', (req, res) => {
    getAllData('estudiantes', res)
})

//? Calificaciones endpoints
app.get('/api/calificaciones', (req, res) => {
    getAllData('calificaciones', res)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});





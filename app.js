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

//send data to database
function sendData(query, values, res){
    connection.query(query, values, (err, results) => {
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.status(201).json({message: 'Elemento creado.', id: results.insertId})
    })
}

//obtain id from ceirtan data
function getIdFromField(tabla, campo, valor) {
    return new Promise((resolve, reject) => {
        const query = `SELECT id FROM ${tabla} WHERE ${campo} = ? LIMIT 1;`

        connection.query(query, [valor], (err, results) => {
            if (err) {
                reject("Couldn't execute query: " + err)
            } else if (results.length === 0) {
                reject(`No record found for ${campo} = ${valor}`)
            } else {
                resolve(results[0].id)
            }
        })
    })
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

app.post('/api/asignaturas', (req, res) =>{
    const { nombre, profesor_id, create_user, create_date } = req.body;

    if (!nombre || !profesor_id || !create_date || !create_user) return res.status(400).json({ error: 'Todos los campos son necesarios' })
    
    if (!create_date || isNaN(new Date(create_date).getTime())) {
        return res.status(400).json({ error: 'El formato de fecha debe ser válido' })
    }

    const query = 'INSERT INTO materias (nombre, profesor_id, create_user, create_date) VALUES (?, ?, ?, ?)'

    sendData(query, [nombre, profesor_id, create_user, create_date], res)
})

//? Estudiantes endpoints
app.get('/api/estudiantes', (req, res) => {
    getAllData('estudiantes', res)
})

app.post('/api/estudiantes', (req, res) =>{
    const { nombre, apellidos, email, matricula, edad, semestre, usuario_creacion, fecha_creacion } = req.body;

    if (!nombre || !apellidos || !email || !matricula || !edad || !semestre || !usuario_creacion || !fecha_creacion) return res.status(400).json({ error: 'Todos los campos son necesarios' })

    if (isNaN(edad)) return res.status(400).json({ error: 'La edad debe ser un número' })

    if (!fecha_creacion || isNaN(new Date(fecha_creacion).getTime())) {
        return res.status(400).json({ error: 'El formato de fecha debe ser válido' })
    }

    const query = 'INSERT INTO estudiantes (nombre, apellidos, email, matricula, edad, semestre, usuario_creacion, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    sendData(query, [nombre, apellidos, email, matricula, edad, semestre, usuario_creacion, fecha_creacion], res)
})

//? Calificaciones endpoints
app.get('/api/calificaciones', (req, res) => {
    getAllData('calificaciones', res)
})

app.post('/api/calificaciones', (req, res) =>{
    const { estudiante_matricula, maestro_correo, materia_nombre, create_user, create_date } = req.body;

    if ( !estudiante_matricula || !maestro_correo || !materia_nombre || !create_user || !create_date) return res.status(400).json({ error: 'Todos los campos son necesarios' })

    if (!create_date || isNaN(new Date(create_date).getTime())) {
        return res.status(400).json({ error: 'El formato de fecha debe ser válido' })
    }

    Promise.all([
        getIdFromField('estudiantes', 'matricula', estudiante_matricula),
        getIdFromField('maestros', 'correo', maestro_correo),
        getIdFromField('materias', 'nombre', materia_nombre)
    ])
    .then(([estudiante_id, maestro_id, materia_id]) => {
        //If all id's where found
        const query = 'INSERT INTO calificaciones (estudiante_id, maestro_id, materia_id, create_user, create_date) VALUES (?, ?, ?, ?, ?)'
        
        sendData(query, [estudiante_id, maestro_id, materia_id, create_user, create_date], res)
    })
    .catch((error) => {
        // If some id isn't found
        res.status(400).json({ error: error })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});





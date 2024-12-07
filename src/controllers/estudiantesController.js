const { getDataFromTable, sendData } = require('../helpers/dbHelpers');

const getEstudiantes = (req, res) => {
    getDataFromTable('estudiantes', res);
}

const createEstudiante = (req, res) => {
    console.log('Received Data:', req.body); // Debugging

    const { nombre, apellidos, email, matricula, edad, semestre, usuario_creacion} = req.body;

    if (!nombre || !apellidos || !email || !matricula || !edad || !semestre || !usuario_creacion)
    {
        return res.status(400).json({ error: 'Todos los campos son necesarios' });
    } 

    // Validates if its a resonable age.
    if (isNaN(edad) || edad > 100 || edad <= 0)
    {
        return res.status(400).json({ error: 'La edad debe ser un número' })
    } 

    // This can be added by the server, (prevents tampering)
    const fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

    const query = 'INSERT INTO estudiantes (nombre, apellidos, email, matricula, edad, semestre, usuario_creacion, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    const values = [nombre, apellidos, email, matricula, edad, semestre, usuario_creacion, fecha_creacion];

    sendData(query, values, res);
}

module.exports = { getEstudiantes, createEstudiante };
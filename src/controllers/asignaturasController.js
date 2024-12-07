const { getDataFromTable, sendData, getIDFromField } = require('../helpers/dbHelpers');

const getAsignaturas = (req, res) => {
    getDataFromTable('materias', res);
}

const createAsignatura = (req, res) => {
    const { nombre, profesor_id, create_user } = req.body;

    if (!nombre || !profesor_id || !create_user)
    {
        return res.status(400).json({ error: 'Todos los campos son necesarios' })
    }

    Promise.all([
        getIDFromField('maestros', 'id', profesor_id)
    ]).then(([profesor_id]) => {
        // This can be added by the server, (prevents tampering)
        const create_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

        const query = 'INSERT INTO materias (nombre, profesor_id, create_user, create_date) VALUES (?, ?, ?, ?)'
        
        const values = [nombre, profesor_id, create_user, create_date];
        
        sendData(query, values, res)    
    }).catch((error) => {
        res.status(400).json({ error: error.message})
    });
}

module.exports = { getAsignaturas, createAsignatura };
const { getDataFromTable, sendData, getIDFromField } = require('../helpers/dbHelpers');

const getAsignaturas = (req, res) => {
    getDataFromTable('materias', res);
}

const createAsignatura = (req, res) => {
    console.log(req.body);
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

// Validates if the phone number is a valid BIGINT and matches a reasonable length
// We could create a Validation Helper, but for the use it has, here is fine
const validatePhoneNumber = (phoneNumber) => {
    // Check if phoneNumber is a valid number and within the BIGINT range
    if (!/^\d+$/.test(phoneNumber)) {
        return { isValid: false, message: 'El número de teléfono debe ser un valor numérico.' };
    }

    // Ensure the phone number fits within the range of a BIGINT (signed 64-bit integer)
    const min = -9223372036854775808;
    const max = 9223372036854775807;

    if (phoneNumber < min || phoneNumber > max) {
        return { isValid: false, message: 'El número de teléfono está fuera del rango de un BIGINT.' };
    }

    return { isValid: true };
};

module.exports = { getAsignaturas, createAsignatura };
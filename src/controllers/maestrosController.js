const { getDataFromTable, sendData } = require('../helpers/dbHelpers');

const getMaestros = (req, res) => {
    getDataFromTable('maestros', res);
}

const createMaestro = (req, res) => {
    const { nombre, edad, telefono, correo, usuario_creacion} = req.body;

    if (!nombre || !edad || !telefono || !correo || !usuario_creacion)
    {
        return res.status(400).json({ error: 'Todos los campos son necesarios' });
    } 

    // Validates if its a resonable age.
    if (isNaN(edad) || edad > 100 || edad <= 0)
    {
        return res.status(400).json({ error: 'La edad debe ser un número' })
    }

    const validation = validatePhoneNumber(telefono);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.message });
    }

    // This can be added by the server, (prevents tampering)
    const fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

    const query = 'INSERT INTO maestros (nombre, edad, telefono, correo, usuario_creacion, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)'

    const values = [nombre, edad, telefono, correo, usuario_creacion, fecha_creacion];

    sendData(query, values, res);
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

module.exports = { getMaestros, createMaestro };
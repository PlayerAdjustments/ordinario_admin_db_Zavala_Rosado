const { getDataFromTable, sendData, getIDFromField } = require('../helpers/dbHelpers');

const getCalificaciones = (req, res) => {
    getDataFromTable('calificaciones', res);
}

const createCalificacion = (req, res) => {
    const { estudiante_matricula, maestro_correo, materia_nombre, create_user } = req.body;

    if ( !estudiante_matricula || !maestro_correo || !materia_nombre || !create_user )
    {
        return res.status(400).json({ error: 'Todos los campos son necesarios' })
    }

    Promise.allSettled([
        getIDFromField('estudiantes', 'matricula', estudiante_matricula),
        getIDFromField('maestros', 'correo', maestro_correo),
        getIDFromField('materias', 'nombre', materia_nombre)
    ])
    .then((results) => {
        // Collect all errors from the results
        const errors = results
        .filter(result => result.status === 'rejected') // Only get rejected promises
        .map(result => result.reason.message); // Extract error messages

        if (errors.length > 0) {
            return res.status(400).json({ errors: errors }); // Return all errors in an array
        }

        // If all IDs were found, proceed with the insertion
        const [estudiante_id, maestro_id, materia_id] = results.map(result => result.value);

        const create_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'
        
        const query = 'INSERT INTO calificaciones (estudiante_id, maestro_id, materia_id, create_user, create_date) VALUES (?, ?, ?, ?, ?)';
        
        const values = [estudiante_id, maestro_id, materia_id, create_user, create_date];

        sendData(query, values, res)
    })
    .catch((error) => {
        // If some internal server error was found
        res.status(500).json({ error: error.message });
    })
}

module.exports = { getCalificaciones, createCalificacion };
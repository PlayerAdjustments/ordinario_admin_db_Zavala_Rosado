const connection = require('../config/database');

const allowedTables = ['asignaturas', 'calificaciones', 'estudiantes', 'maestros']

const getDataFromTable = (table, res) => {

    if(!allowedTables.includes(table))
    {
        return res.status(400).json({ error: 'Invalid table name'});
    }

    const query = `SELECT * FROM ??`;

    connection.query(query, [table], (err, results) => {
        if(err)
        {
            console.log("Couldn't execute query: ", err);
            return res.status(500).json({ error: 'Database query failed'});
        }

        return res.json(results);
    });
}

const sendData = (query, values, res) => {
    connection.query(query, values, (err, results) => {
        if (err)
        {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: 'Elemento creado.', id: results.insertId});
    });
}

const getIDFromField = (table, field, value) => {
    return new Promise((resolve, reject) => {
        if(!allowedTables.includes(table))
        {
            return res.status(400).json({ error: 'Invalid table name'});
        }

        const query = `SELECT id FROM ?? WHERE ?? = ? LIMIT 1`;

        connection.query(query, [table, field, value], (err, results) => {
            if(err)
            {
                return reject(new Error("Couldn't execute query: " + err));
            }

            if(results.length === 0)
            {
                return reject(new Error(`No record for ${field} = ${value}`));
            }

            resolve(results[0].id);
        });
    });
}

module.exports = { getDataFromTable, sendData, getIDFromField };
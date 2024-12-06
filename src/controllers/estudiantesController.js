const { getDataFromTable, sendData } = require('../helpers/dbHelpers');

const getEstudiantes = (req, res) => {
    getDataFromTable('estudiantes', res);
}

const createEstudiante = (req, res) => {
    return req.body;
}

module.exports = { getEstudiantes, createEstudiante };
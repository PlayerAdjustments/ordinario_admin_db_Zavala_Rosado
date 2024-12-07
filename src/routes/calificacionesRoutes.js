const express = require('express');
const router = express.Router();
const { getCalificaciones, createCalificacion } = require('../controllers/calificacionesController');

router.get('/', getCalificaciones);
router.post('/', createCalificacion);

module.exports = router;
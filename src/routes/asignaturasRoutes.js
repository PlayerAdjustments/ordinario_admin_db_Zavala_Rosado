const express = require('express');
const router = express.Router();
const { getAsignaturas, createAsignatura } = require('../controllers/asignaturasController');

router.get('/', getAsignaturas);
router.post('/', createAsignatura);

module.exports = router;
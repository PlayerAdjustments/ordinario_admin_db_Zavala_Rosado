const express = require('express');
const router = express.Router();
const { getEstudiantes, createEstudiante } = require('../controllers/estudiantesController');

router.get('/', getEstudiantes);
router.post('/', createEstudiante);

module.exports = router;
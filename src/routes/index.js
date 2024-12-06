const express = require('express');
const router = express.Router();

const asignaturasRoutes = require('./asignaturasRoutes');
const calificacionesRoutes = require('./calificacionesRoutes');
const estudiantesRoutes = require('./estudiantesRoutes');
const maestrosRoutes = require('./maestrosRoutes');

// router.use('/asignaturas', asignaturasRoutes);
// router.use('/calificaciones', calificacionesRoutes);
router.use('/estudiantes', estudiantesRoutes);
// router.use('/maestros', maestrosRoutes);


module.exports = router;
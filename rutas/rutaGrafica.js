const express = require("express");
const { getHola } = require("../controlador/controladorUsuario");
const { crearGrafica } = require("../controlador/controladorGrafica");
const { proteger } = require("../controlador/controladorAut");

const router = express.Router();

//router.post("/usuario", controladorUsuario.crearUsuario);
router.post("/crear-grafica", proteger, crearGrafica);

module.exports = router;

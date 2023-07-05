const express = require("express");

const {
  getIniciarSesion,
  getTabla,
  getRegistrar,
  getPaciente,
  getGrafica,
} = require("../controlador/controladorVista");
const { proteger, activo } = require("../controlador/controladorAut");
const router = express.Router();

router.use(activo);
router.get("/", getIniciarSesion);
router.get("/registrar", getRegistrar);
router.get("/grafica", proteger, getTabla);
router.get("/grafica/:pID", proteger, getPaciente);
router.get("/graficas-paciente/:pID", proteger, getGrafica);

module.exports = router;

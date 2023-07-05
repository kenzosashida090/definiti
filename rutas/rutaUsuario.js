const express = require("express");
const controladorUsuario = require("../controlador/controladorUsuario");
const {
  inicio,
  crearCuenta,
  proteger,
  cerrarSesion,
} = require("../controlador/controladorAut");

const router = express.Router();
//router.post("/usuario", controladorUsuario.crearUsuario);
router.get("/", proteger, controladorUsuario.getHola);
router.post("/crear", crearCuenta);
router.post("/usuario", inicio);
router.get("/cerrarSesion", cerrarSesion);
module.exports = router;

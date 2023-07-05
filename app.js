const express = require("express");
const dotenv = require("dotenv");
const xss = require("xss-clean");
const path = require("path");
const bodyParser = require("body-parser");
const errorGlobal = require("./controlador/controladorErrores");
const rateLimit = require("express-rate-limit");
const app = express();
const AppError = require("./utilidades/appError");
const rutaUsuario = require("./rutas/rutaUsuario");
const rutaVista = require("./rutas/rutaVista");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const rutaGrafica = require("./rutas/rutaGrafica.js");
const rutaPaciente = require("./rutas/rutaPaciente");
app.use(cookieParser());
app.use(cors());

app.set("view engine", "pug");
app.set("vista", path.join(__dirname, "vista"));
app.use(express.static(path.join(__dirname, "publico")));
dotenv.config({ path: "./config.env" });
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
app.use("/", rutaVista);
app.use("/api/inicio", rutaUsuario);
app.use("/api/pacientes", rutaPaciente);
app.use("/api/graficas", rutaGrafica);

app.all("*", (req, res, next) => {
  // //all the errors will be handle here and bellow
  // // The '*' means that select all urls
  // // We need to  set the err status and code to finally use another middleware to handle that error
  // //The next middleware will set as a error middleware
  // res.status(404).json({
  //   status: "fail",
  //   message: `No se puede encontrar ${req.originalUrl} en este servidor`,
  // }); //if we pass an argument to next will automatically will set as an error

  next(
    new AppError(
      `No se puede encontrar ${req.originalUrl} en este servidor`,
      404
    )
  );
});

app.use(errorGlobal);
module.exports = app;

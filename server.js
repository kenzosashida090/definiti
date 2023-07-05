const dotenv = require("dotenv");
const mqtt = require("mqtt");
const mongoose = require("mongoose");
const app = require("./app");
const puerto = 3000;
dotenv.config({ path: "./config.env" });
const protocolo = "mqtt";
const host = "192.168.1.89";
const port = "1883";
const clienteID = "mqtt_1";

const enlaceURL = `${protocolo}://${host}:${port}`;

const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos");
  });

const cliente = mqtt.connect(enlaceURL, {
  clienteID,
  clean: true,
  connectTimeout: 4000,
  username: "arduino",
  password: "123",
  reconnectPeriod: 1000,
});

const servidor = app.listen(puerto, () => {
  console.log(`Conectado al puerto ${puerto}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  servidor.close(() => {
    process.exit(1);
  });
});
module.exports = cliente;

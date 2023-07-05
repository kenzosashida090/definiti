import "@babel/polyfill";
import { crearDoctor, login, logout, crearPaciente } from "./iniciarSesion";
import mqtt from "paho-mqtt";
import Chart from "chart.js/auto";

import moment from "moment";
import { pubECG } from "./mqttConexion";
let suscrito = false;

const formInicio = document.querySelector(".form--login");
const formRegistro = document.querySelector(".form--registro");
const cerrarBoton = document.querySelector(".logout");
const formPaciente = document.querySelector(".form--paciente");
const formECG = document.querySelector(".form--ecg");
const btnLogico = document.querySelector("#btnG");

const btnPub = document.querySelector("#btnPECG");
const protocolo = "ws"; // Utiliza "ws" para WebSocket o "wss" para WebSocket seguro (SSL/TLS)
const host = "192.168.1.89";
const port = 9001;
const clienteID = "mqtt_1";
const canvas = document.getElementById("chart");
const enlaceURL = `${protocolo}://${host}:${port}`;
const cliente = new mqtt.Client(host, port, clienteID);
let ecgDato = [];
let tiempo = [];
if (formInicio) {
  document.querySelector(".form--login"),
    addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
    });
}
if (cerrarBoton) {
  console.log("cerrar");
  cerrarBoton.addEventListener("click", logout);
}
if (formECG) {
  const id = document.getElementById("idP").innerHTML;
  formECG.addEventListener("submit", (e) => {
    e.preventDefault();
    const comentario = document.getElementById("comment").value;
    pubECG(id, tiempo, ecgDato, comentario);
    console.log(comentario);
  });
  btnPub.disabled = true;
  btnPub.style.backgroundColor = "#DFD7BF";
}
if (canvas) {
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "line", // Tipo de gráfico (puede ser "line", "bar", "pie", etc.)
    data: {
      labels: [], // Etiquetas de los datos en el eje X
      datasets: [
        {
          label: "Datos", // Etiqueta del conjunto de datos
          data: [], // Datos a graficar
          backgroundColor: "rgba(0, 123, 255, 0.4)", // Color de fondo del gráfico
          borderColor: "rgba(0, 123, 255, 1)", // Color del borde del gráfico
          borderWidth: 1, // Ancho del borde del gráfico
        },
      ],
    },
    options: {
      responsive: true, // Hace que el gráfico sea sensible al tamaño de la ventana
      scales: {
        x: {
          type: "linear",
          display: true, // Muestra el eje X
        },
        y: {
          type: "linear",
          display: true, // Muestra el eje Y
        },
      },
    },
  });

  btnLogico.addEventListener("click", () => {
    const id = document.getElementById("idP").innerHTML;
    console.log(id);
    console.log(suscrito);

    if (!suscrito) {
      ecgDato = [];
      tiempo = [];
      let inicio = moment();
      suscrito = true;
      btnLogico.textContent = "Detener Suscripcion";
      cliente.connect({
        onSuccess: () => {
          console.log("Conexión exitosa al broker MQTT");
          // Suscribirse a los temas
          cliente.subscribe("testTopic");
        },
        onFailure: (error) => {
          console.error("Error en la conexión MQTT:", error.errorMessage);
        },
      });
      cliente.onMessageArrived = (mensaje) => {
        btnPub.disabled = true;
        btnPub.style.backgroundColor = "#DFD7BF";
        let tiempoTranscurrido = moment().diff(inicio, "milliseconds");
        console.log("Tiempo transcurrido:", tiempoTranscurrido, "segundos");
        const valor = parseFloat(mensaje.payloadString);

        ecgDato.push(valor);
        tiempo.push(tiempoTranscurrido);

        chart.data.labels.push(tiempoTranscurrido);
        chart.data.datasets[0].data.push(valor);

        chart.update();
      };
    } else {
      btnPub.style.backgroundColor = "#0d9ea3";
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.update();
      btnPub.disabled = false;
      suscrito = false;
      btnLogico.textContent = "Suscribirse";
      cliente.disconnect();
    }
  });
}

if (formPaciente) {
  document
    .getElementById("openPopupBtn")
    .addEventListener("click", function () {
      document.getElementById("popup").style.display = "block";
    });

  document
    .getElementById("closePopupBtn")
    .addEventListener("click", function () {
      document.getElementById("popup").style.display = "none";
    });

  formPaciente.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreP").value;
    const telefono = document.getElementById("telP").value;
    const edad = document.getElementById("edadP").value;
    const email = document.getElementById("correoP").value;
    const sexo = document.getElementById("sexoP").value;
    crearPaciente(nombre, email, edad, sexo, telefono);
  });
}

if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const cedula = document.getElementById("cedula").value;
    const numeroTrabajo = document.getElementById("NT").value;
    const telefono = document.getElementById("telefono").value;
    const nombreClinica = document.getElementById("NC").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const confirmarContrasena = document.getElementById("contrasenaC").value;
    crearDoctor(
      nombre,
      cedula,
      numeroTrabajo,
      telefono,
      nombreClinica,
      correo,
      contrasena,
      confirmarContrasena
    );
  });
}

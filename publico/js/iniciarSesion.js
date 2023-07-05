import axios from "axios";
import { mostrarAlerta } from "./alertas";
export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/inicio/usuario",
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if (res.data.status === "exitoso") {
      mostrarAlerta("exitoso", "Sesion Iniciada!");
      window.setTimeout(() => {
        location.assign("/grafica");
      }, 1500);
      console.log(res.data);
    }
  } catch (err) {
    mostrarAlerta("error", err.response.data.message);
  }
};

export const crearDoctor = async (
  nombre,
  cedula,
  numeroTrabajo,
  telefono,
  nombreClinica,
  email,
  password,
  confirmarContrasena
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/inicio/crear",
      data: {
        nombre,
        cedula,
        numeroTrabajo,
        telefono,
        nombreClinica,
        email,
        password,
        confirmarContrasena,
      },
    });

    if (res.data.status === "exitoso") {
      mostrarAlerta("exitoso", "Registro exitoso!");
      window.setTimeout(() => {
        location.assign("/grafica");
      }, 1500);
      console.log(data);
    }
  } catch (err) {
    mostrarAlerta("error", "Algo salio mal en el registro del doctor!");
  }
};

export const crearPaciente = async (nombre, email, edad, sexo, telefono) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/pacientes/registro-paciente",
      data: {
        nombre,
        email,
        edad,
        sexo,
        telefono,
      },
    });

    if (res.data.status === "exitoso") {
      mostrarAlerta("exitoso", "registro exitoso");
      window.setTimeout(() => {
        document
          .getElementById("closePopupBtn")
          .addEventListener("click", function () {
            document.getElementById("popup").style.display = "none";
          });
        location.assign("/grafica");
      }, 1500);
      console.log(data);
    }
  } catch (err) {
    mostrarAlerta("error", "Algo salio mal en el registro del paciente");
  }
};

export const logout = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/inicio/cerrarSesion",
    });

    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};

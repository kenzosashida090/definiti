import { mostrarAlerta } from "./alertas";
import axios from "axios";
export const pubECG = async (id, tiempo, ecgDato, comentario) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/graficas/crear-grafica",
      data: {
        id,
        tiempo,
        ecgDato,
        comentario,
      },
    });
    if (res.data.status === "exitoso") {
      mostrarAlerta("exitoso", "Registro exitoso!");
      window.setTimeout(() => {
        location.assign("/grafica");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    mostrarAlerta("error", "Algo salio mal en el registro del ECG!");
  }
};

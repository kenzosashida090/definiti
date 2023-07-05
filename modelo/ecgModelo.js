const mongoose = require("mongoose");

const ecgEsquema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente" },
  fechaPrueba: {
    type: Date,
    default: Date.now,
  },
  comentario: {
    type: String,
  },
  ecgDato: {
    type: [Number],
    require: true,
  },
  tiempo: {
    type: [Number],
    require: true,
  },
});
const Ecg = mongoose.model("Ecg", ecgEsquema);

module.exports = Ecg;

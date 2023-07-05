const mongoose = require("mongoose");
const validator = require("validator");

const esquemaPaciente = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Campo obligatorio"],
    // maxlength: [40, 'A name can handle max 40 letters'],
    // minlength: [10, 'A ma,e can handle min 10 letters'],
  },
  email: {
    type: String,
    required: [true, "Campo obligatorio"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "The email must have to exist"],
  },
  edad: {
    type: Number,
    required: [true, "Campo obligatorio"],
  },
  sexo: {
    type: String,
    required: [true, "Campo obligatorio"],
  },
  telefono: {
    type: Number,
    required: [true, "Campo obligatorio"],
    maxlength: [10, "Tiene que tener 10 caracteres"],
  },
  lugarAtencion: {
    type: String,
  },
  fechaIngreso: {
    type: Date,
    default: Date.now,
  },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
});

const Paciente = mongoose.model("Paciente", esquemaPaciente);

module.exports = Paciente;

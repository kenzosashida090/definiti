const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const esquemaDoctor = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Campo obligatorio"],
  },
  email: {
    type: String,
    required: [true, "Campo obligatorio"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "The email must have to exist"],
  },
  password: {
    type: String,
    required: [true, "Campo obligatorio"],
    minlength: [8, "Tiene que tener mas de 8 caracteres"],
    select: false,
  },
  cedula: {
    type: String,
    required: [true, "Campo obligatorio"],
    maxlength: [10, "Tiene que tener 10 caracteres"],
    select: false,
  },
  numeroTrabajo: {
    type: String,
    required: [true, "Campo obligatorio"],
    maxlength: [5, "Tiene que tener 5 caracteres"],
    select: false,
  },
  telefono: {
    type: Number,
    required: [true, "Campo obligatorio"],
    maxlength: [10, "Tiene que tener 10 caracteres"],
    select: false,
  },
  nombreClinica: {
    type: String,
    required: [true, "Campo obligatorio"],
  },
  confirmarContrasena: {
    type: String,
    required: [true, "Confirma tu contrasena"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Las contrasenas no son las mismas",
    },
  },
});
esquemaDoctor.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmarContrasena = undefined;
  next();
});
esquemaDoctor.methods.passwordCorrecta = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
esquemaDoctor.methods.passwordCambiada = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
const Doctor = mongoose.model("Doctor", esquemaDoctor);

module.exports = Doctor;

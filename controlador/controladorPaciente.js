const Paciente = require("../modelo/pacienteModelo");
const catchAsync = require("../utilidades/catchAsync");
const AppError = require("../utilidades/catchAsync");

exports.crearPaciente = catchAsync(async (req, res, next) => {
  //   console.log(req);
  const { nombre, email, edad, sexo, telefono } = req.body;
  const { nombreClinica, _id } = req.user;

  console.log(req.user);
  const nuevoPaciente = await Paciente.create({
    nombre,
    email,
    edad,
    sexo,
    telefono,
    lugarAtencion: nombreClinica,
    doctor: _id,
  });
  res.status(201).json({
    status: "exitoso",
    data: {
      nuevoPaciente,
    },
  });
});

exports.getPaciente = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  const paciente = await Paciente.find(_id);
  if (!paciente) {
    return next(new AppError("Ningun paciente se encontro con ese ID", 404));
  }
});

exports.pacienteId = catchAsync(async (req, res, next) => {
  console.log("hola", req.params);

  const { pID } = req.params;

  const pacienteID = await Paciente.findById(pID);
  res.status(202).json({
    status: "exitoso",
    data: { pacienteID },
  });
  if (!pacienteID) {
    return next(new AppError("Ningun paciente se encontro con ese ID", 404));
  }
});

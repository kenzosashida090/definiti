const Usuario = require("../modelo/usuarioModelo");
const catchAsync = require("../utilidades/catchAsync");

exports.getHola = catchAsync(async (req, res, next) => {
  res.status(202).json({
    status: "Hola",
  });
});

const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const AppError = require("../utilidades/appError");
const catchAsync = require("../utilidades/catchAsync");
const Doctor = require("../modelo/usuarioModelo");

const iniciarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //this is returned automatically beacause of the =>
const enviarTokenCreada = (status, user, res, req) => {
  const token = iniciarToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;
  res.status(status).json({
    status: "exitoso",
    token,
    data: {
      user,
    },
  });
};
exports.crearCuenta = catchAsync(async (req, res, next) => {
  const nuevoDoctor = await Doctor.create(req.body);
  const url = `${req.protocol}://${req.get("host")}/sho`;

  enviarTokenCreada(201, nuevoDoctor, res);
});
const mensaje = "No hay correo o password con esa informacion";
exports.inicio = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(mensaje, 400));
  }

  const doctor = await Doctor.findOne({ email }).select("+password");
  if (!doctor || !(await doctor.passwordCorrecta(password, doctor.password))) {
    return next(new AppError(mensaje, 401));
  }

  enviarTokenCreada(200, doctor, res);
});
exports.proteger = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("NO has iniciado sesion!", 404));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const usuarioActual = await Doctor.findById(decoded.id);
  if (!usuarioActual) {
    return next(
      new AppError("El token perteneciente a este doctor no existe"),
      401
    );
  }

  if (usuarioActual.passwordCambiada(decoded.iat)) {
    return next(
      new AppError(
        "Recientemente el Doctor cambio su contrasena, vuelva a iniciar!",
        401
      )
    );
  }

  req.user = usuarioActual;
  res.locals.user = usuarioActual;
  next();
});
exports.activo = async (req, res, next) => {
  let token;
  try {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;

      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const usuarioActual = await Doctor.findById(decoded.id);
      if (!usuarioActual) {
        return next();
      }

      if (usuarioActual.passwordCambiada(decoded.iat)) {
        return next();
      }

      res.locals.user = usuarioActual;
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.olvidePassword = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) return next(new AppError("Not found user", 404));

  console.log(req.protocol);
  const resetToken = doctor.createPasswordResetToken();
  await doctor.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/resetPassword/${resetToken}`;
    await new Email(doctor, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "exitoso",
      message: "Token ha sido enviada",
    });
  } catch (err) {
    doctor.passwordResetToken = undefined;
    doctor.passwordResetExpires = undefined;
    await doctor.save({ validateBeforeSave: false });
    return next(new AppError("Error al mandar el correo", 500));
  }
});
exports.reiniciarPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const doctor = await Doctor.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!doctor) return next(new AppError("Invalid token or has expired", 400));
  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  doctor.passwordResetToken = undefined;
  doctor.passwordResetExpires = undefined;
  await doctor.save();

  enviarTokenCreada(200, doctor, res);
});
exports.cerrarSesion = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
exports.actualizarPassword = catchAsync(async (req, res, next) => {
  const { actualPassword } = req.body;

  const doctor = await Doctor.findById(req.user.id).select("+password");

  if (!(await doctor.correctPassword(actualPassword, doctor.password))) {
    return next(new AppError("Usuario no encontrado", 401));
  }

  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  await doctor.save();

  enviarTokenCreada(200, doctor, res);
});

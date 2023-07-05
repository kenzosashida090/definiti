class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; //codigos de htpp
    this.isOperational = true; //nosotros lo provoacmos

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

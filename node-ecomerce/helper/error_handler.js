function errorHandler(err, req, res, next) {
  // ? jwt auth error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  // ? validation error
  if (err.name ==='Validation') {
    return res.status(401).json({message: err})
  }

  //? default server error
  return res.status(500).json({message: err})
}

module.exports = errorHandler;
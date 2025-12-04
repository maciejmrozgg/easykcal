const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Brak tokena, dostęp zabroniony",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Save data user to request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Nieprawidłowy lub wygasły token",
    });
  }
}

module.exports = authMiddleware;
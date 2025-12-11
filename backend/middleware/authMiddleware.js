const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    //Try to get the token from the cookie
    let token = req.cookies?.token;

    //If there is no cookie, try getting the token from the Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Brak tokena, dostęp zabroniony",
      });
    }

    //Token veryfication
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
const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/userModel");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Niepoprawny format adresu email"
      });
    }

    const strongPassword = password.length >= 8
      && /[A-Z]/.test(password)
      && /[0-9]/.test(password);

    if (!strongPassword) {
      return res.status(400).json({
        message: "Hasło musi mieć minimum 8 znaków, cyfrę i wielką literę"
      });
    }


    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(email, hashedPassword);

    return res.status(201).json({
      message: "Użytkownik utworzony pomyślnie",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
};

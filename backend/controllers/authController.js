const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../models/userModel");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
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

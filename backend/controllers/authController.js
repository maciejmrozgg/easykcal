const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email i hasło są wymagane",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Nieprawidłowy email lub hasło",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Nieprawidłowy email lub hasło",
      });
    }

    //Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    //Save JWT to cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //on production true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //Return only user data (without token)
    return res.status(200).json({
      message: "Zalogowano pomyślnie",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, //on production true
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Wylogowano pomyślnie" });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Nie zalogowany" });

    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      user: {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Nie zalogowany" });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};

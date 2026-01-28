const request = require("supertest");
const app = require("../../app");
const pool = require("../../config/db");

const loginOrRegister = async ({ email, password, role = "user" }) => {
  // try login
  let loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password });

  if (loginRes.statusCode !== 200) {
    // if it doesn't exist → register
    await request(app)
      .post("/auth/register")
      .send({ email, password });

    loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
  }

  // if admin → set role
  if (role === "admin") {
    await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1",
      [email]
    );

    // re-login after role change
    loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
  }

  return loginRes.body.token;
};

module.exports = { loginOrRegister };
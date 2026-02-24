const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("Auth API – validation & basic flow", () => {

  it("POST /auth/register - missing email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ password: "Test1234!" });

    expect(res.statusCode).toBe(400);
  });

  it("POST /auth/register - weak password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "123" });

    expect(res.statusCode).toBe(400);
  });

  it("POST /auth/login - wrong password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "auth@test.com", password: "Test1234!" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "auth@test.com", password: "Wrong123!" });

    expect(res.statusCode).toBe(401);
  });

  it("GET /auth/me - without token", async () => {
    const res = await request(app)
      .get("/auth/me");

    expect(res.statusCode).toBe(401);
  });
});
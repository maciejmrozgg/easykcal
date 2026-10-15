const request = require("supertest");
const app = require("../app");

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

  it("POST /auth/login - sets HttpOnly cookie without returning token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "auth@token.com", password: "Token1234!" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "auth@token.com", password: "Token1234!" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeUndefined();
    expect(res.headers["set-cookie"].some((element) => element.includes("HttpOnly"))).toBe(true);
  });

  it("GET /auth/me - without token", async () => {
    const res = await request(app)
      .get("/auth/me");

    expect(res.statusCode).toBe(401);
  });
});
const request = require("supertest");
const app = require("../app");
let token;

beforeAll(async () => {
  // logowanie testowego użytkownika i pobranie tokena
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "Test123!" });

  token = res.body.token; // token z JSON
});

describe("Recipes API", () => {
  it("GET /api/recipes - should return array", async () => {
    const res = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/recipes - should create recipe", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Recipe",
        description: "Test Desc",
        ingredients: ["egg", "milk"],
        instructions: ["mix", "fry"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Recipe");
  });
});
const request = require("supertest");
const app = require("../app");
let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "Test123!" });

  token = res.body.token; // token z JSON
});

describe("Schedule API", () => {
  it("GET /api/schedule - should return array", async () => {
    const res = await request(app)
      .get("/api/schedule")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/schedule - should create schedule item", async () => {
    const res = await request(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({ dayOfWeek: "Monday", mealName: "Breakfast", recipeId: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body.mealName).toBe("Breakfast");
  });
});
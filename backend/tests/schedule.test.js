const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");
const { loginOrRegister } = require("./helpers/auth");

let token;
const YEAR = 2026;
const MONTH = 0; // January
let mealId;

beforeAll(async () => {
  token = await loginOrRegister({
    email: "schedule@test.com",
    password: "Testowe123!",
  });
});

describe("Schedule API", () => {
  it("GET /api/schedule/:year/:month - creates and returns monthly schedule", async () => {
    const res = await request(app)
      .get(`/api/schedule/${YEAR}/${MONTH}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.year).toBe(YEAR);
    expect(res.body.month).toBe(MONTH);
    expect(Array.isArray(res.body.meals)).toBe(true);
    expect(Array.isArray(res.body.days)).toBe(true);
    expect(res.body.days.length).toBeGreaterThan(0);
  });

  it("PATCH /limits - updates monthly limits", async () => {
    const res = await request(app)
      .patch(`/api/schedule/${YEAR}/${MONTH}/limits`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        deficitLimit: 1400,
        zeroLimit: 1600,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.kcal_limit).toBe(1400);
    expect(res.body.zero_kcal_limit).toBe(1600);
  });

  it("PATCH /limits - rejects invalid limits", async () => {
    const res = await request(app)
      .patch(`/api/schedule/${YEAR}/${MONTH}/limits`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        deficitLimit: 1600,
        zeroLimit: 1400,
      });

    expect(res.statusCode).toBe(400);
  });

  it("POST /meal - adds new meal", async () => {
    const res = await request(app)
      .post(`/api/schedule/${YEAR}/${MONTH}/meal`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Kolacja" });

    expect(res.statusCode).toBe(200);
    expect(res.body.meals.some(m => m.name === "Kolacja")).toBe(true);

    mealId = res.body.meals.find(m => m.name === "Kolacja").id;
  });

  it("PATCH /meal/:mealId - renames meal", async () => {
    const res = await request(app)
      .patch(`/api/schedule/${YEAR}/${MONTH}/meal/${mealId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Późna kolacja" });

    expect(res.statusCode).toBe(200);
    expect(res.body.meals.find(m => m.id === mealId).name)
      .toBe("Późna kolacja");
  });

  it("POST /ingredient - adds ingredient to day", async () => {
    const date = "2026-01-05";

    const res = await request(app)
      .post(`/api/schedule/${YEAR}/${MONTH}/day/${date}/ingredient`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        mealId,
        name: "Ryż",
        weight: 100,
        kcal: 130,
      });

    expect(res.statusCode).toBe(200);

    const day = res.body.days.find(d => d.date === date);
    expect(day.meals[mealId].length).toBe(1);
    expect(day.meals[mealId][0].name).toBe("Ryż");
  });

  it("PATCH /ingredient/:index - updates ingredient", async () => {
    const date = "2026-01-05";

    const res = await request(app)
      .patch(`/api/schedule/${YEAR}/${MONTH}/day/${date}/ingredient/0`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        mealId,
        name: "Ryż basmati",
        weight: 120,
        kcal: 150,
      });

    expect(res.statusCode).toBe(200);

    const ingredient =
      res.body.days.find(d => d.date === date).meals[mealId][0];

    expect(ingredient.name).toBe("Ryż basmati");
  });

  it("DELETE /ingredient/:index - deletes ingredient", async () => {
    const date = "2026-01-05";

    const res = await request(app)
      .delete(`/api/schedule/${YEAR}/${MONTH}/day/${date}/ingredient/0`)
      .set("Authorization", `Bearer ${token}`)
      .send({ mealId });

    expect(res.statusCode).toBe(200);

    const day = res.body.days.find(d => d.date === date);
    expect(day.meals[mealId].length).toBe(0);
  });

  it("DELETE /meal/:mealId - deletes meal", async () => {
    const res = await request(app)
      .delete(`/api/schedule/${YEAR}/${MONTH}/meal/${mealId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.meals.some(m => m.id === mealId)).toBe(false);
  });
});

afterAll(async () => {
  await pool.end();
});
const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");
const { loginOrRegister } = require("./helpers/auth");

let userToken;
let adminToken;
let id;
let categoryName;

beforeAll(async () => {
  userToken = await loginOrRegister({
    email: "testowy@mail.com",
    password: "Testowe123!",
    role: "user",
  });

  adminToken = await loginOrRegister({
    email: "testowyadmin@mail.com",
    password: "Testowe123!",
    role: "admin",
  });
});

describe("Categories API – CRUD", () => {
  it("GET /api/categories - should return array", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/categories - user creates category", async () => {
    categoryName = `Test Category ${Date.now()}`;

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: categoryName });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(categoryName);

    id = res.body.id;
    expect(id).toBeDefined();
  });

  it("PUT /api/categories/:id - owner updates", async () => {
    const res = await request(app)
      .put(`/api/categories/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated Category" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Category");
  });

  it("PUT /api/categories/:id - other user forbidden", async () => {
    const otherToken = await loginOrRegister({
      email: "other@mail.com",
      password: "Test123!",
      role: "user",
    });

    const res = await request(app)
      .put(`/api/categories/${id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ name: "Hack" });

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/categories/:id - owner deletes", async () => {
    const res = await request(app)
      .delete(`/api/categories/${id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Category deleted");
  });
});
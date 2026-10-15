const request = require("supertest");
const app = require("../app");
const { loginOrRegister } = require("./helpers/auth");

let userAgent;
let id;
let categoryName;

beforeAll(async () => {
  userAgent = await loginOrRegister({
    email: "testowy@mail.com",
    password: "Testowe123!",
    role: "user",
  });
});

describe("Categories API – CRUD", () => {
  it("GET /api/categories - should return array", async () => {
    const res = await userAgent
      .get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/categories - user creates category", async () => {
    categoryName = `Test Category ${Date.now()}`;

    const res = await userAgent
      .post("/api/categories")
      .send({ name: categoryName });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(categoryName);

    id = res.body.id;
    expect(id).toBeDefined();
  });

  it("PUT /api/categories/:id - owner updates", async () => {
    const res = await userAgent
      .put(`/api/categories/${id}`)
      .send({ name: "Updated Category" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Category");
  });

  it("PUT /api/categories/:id - other user forbidden", async () => {
    const otherAgent = await loginOrRegister({
      email: "other@mail.com",
      password: "Test123!",
      role: "user",
    });

    const res = await otherAgent
      .put(`/api/categories/${id}`)
      .send({ name: "Hack" });

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/categories/:id - owner deletes", async () => {
    const res = await userAgent
      .delete(`/api/categories/${id}`)

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Category deleted");
  });
});
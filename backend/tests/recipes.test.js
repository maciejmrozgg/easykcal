const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");
const { loginOrRegister } = require("./helpers/auth");

let userToken;
let adminToken;
let recipeId;

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

describe("Recipes API – CRUD (JWT)", () => {
  it("GET /api/recipes - should return array", async () => {
    const res = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/recipes - user creates recipe", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Test Recipe",
        description: "Test Desc",
        ingredients: ["egg", "milk"],
        instructions: ["mix", "fry"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Recipe");

    recipeId = res.body.id;
  });

  it("GET /api/recipes/:id - should return recipe", async () => {
    const res = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(recipeId);
  });

  it("PUT /api/recipes/:id - owner can update", async () => {
    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Updated Recipe",
        description: "Updated Desc",
        ingredients: ["egg"],
        instructions: ["cook"],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Recipe");
  });

  it("PUT /api/recipes/:id - other user forbidden", async () => {
    const otherToken = await loginOrRegister({
      email: "othertestowy@mail.com",
      password: "Other123!",
      role: "user",
    });

    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "Hack" });

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/recipes/:id - non-admin forbidden", async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/recipes/:id - admin can delete", async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Recipe deleted");
  });
});
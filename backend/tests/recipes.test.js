const request = require("supertest");
const app = require("../app");
const { loginOrRegister } = require("./helpers/auth");

let userAgent;
let adminAgent;
let recipeId;

beforeAll(async () => {
  userAgent = await loginOrRegister({
    email: "testowy@mail.com",
    password: "Testowe123!",
    role: "user",
  });

  adminAgent = await loginOrRegister({
    email: "testowyadmin@mail.com",
    password: "Testowe123!",
    role: "admin",
  });
});

describe("Recipes API – CRUD", () => {
  it("GET /api/recipes - should return array", async () => {
    const res = await userAgent
      .get("/api/recipes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/recipes - user creates recipe", async () => {
    const res = await userAgent
      .post("/api/recipes")
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
    const res = await userAgent
      .get(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(recipeId);
  });

  it("PUT /api/recipes/:id - owner can update", async () => {
    const res = await userAgent
      .put(`/api/recipes/${recipeId}`)
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
    const otherAgent = await loginOrRegister({
      email: "othertestowy@mail.com",
      password: "Other123!",
      role: "user",
    });

    const res = await otherAgent
      .put(`/api/recipes/${recipeId}`)
      .send({ title: "Hack" });

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/recipes/:id - non-admin forbidden", async () => {
    const res = await userAgent
      .delete(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toBe(403);
  });

  it("DELETE /api/recipes/:id - admin can delete", async () => {
    const res = await adminAgent
      .delete(`/api/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Recipe deleted");
  });
});
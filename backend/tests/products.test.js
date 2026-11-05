const request = require("supertest");
const app = require("../app");
const { loginOrRegister } = require("./helpers/auth");
const pool = require("../config/db");

let userAgent;
let otherUserAgent;
let adminAgent;
let id;
let productName;
let productNameOwnership;
let globalProductId;
let globalProductName;

beforeAll(async () => {
    userAgent = await loginOrRegister({
        email: "testowy@mail.com",
        password: "Testowe123!",
        role: "user",
    });

    otherUserAgent = await loginOrRegister({
        email: "testowyinny@mail.com",
        password: "Testowe1234!@",
        role: "user",
    });

    adminAgent = await loginOrRegister({
        email: "admin@mail.com",
        password: "Testowe1234!",
        role: "admin",
    });
});

describe("Products API – CRUD", () => {
    it("GET /products - should return array", async () => {
        const res = await userAgent
            .get("/products");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("kcalPer100g");
            expect(res.body[0]).toHaveProperty("fatPer100g");
            expect(res.body[0]).toHaveProperty("proteinPer100g");
            expect(res.body[0]).toHaveProperty("carbsPer100g");
        }
    });

    it("POST /products - user creates product", async () => {
        productName = `Test Product ${Date.now()}`;

        const res = await userAgent
            .post("/products")
            .send({
                name: productName,
                kcalPer100g: 250,
                fatPer100g: 10,
                proteinPer100g: 5,
                carbsPer100g: 30,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(productName);
        expect(res.body.kcalPer100g).toBe(250);
        expect(res.body.fatPer100g).toBe(10);
        expect(res.body.proteinPer100g).toBe(5);
        expect(res.body.carbsPer100g).toBe(30);

        id = res.body.id;
        expect(id).toBeDefined();
    });

    it("GET /products - should contain created product", async () => {
        const res = await userAgent
            .get("/products");

        expect(res.statusCode).toBe(200);

        const created = res.body.find(p => p.id === id);

        expect(created).toBeDefined();
        expect(created.name).toBe(productName);
        expect(created.kcalPer100g).toBe(250);
        expect(created.proteinPer100g).toBe(5);
        expect(created.fatPer100g).toBe(10);
        expect(created.carbsPer100g).toBe(30);
    });

    it("PUT /products/:id - user updates product", async () => {

        const res = await userAgent
            .put(`/products/${id}`)
            .send({
                name: `${productName} Updated`,
                kcalPer100g: 450,
                fatPer100g: 20,
                proteinPer100g: 15,
                carbsPer100g: 50,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(`${productName} Updated`);
        expect(res.body.kcalPer100g).toBe(450);
        expect(res.body.fatPer100g).toBe(20);
        expect(res.body.proteinPer100g).toBe(15);
        expect(res.body.carbsPer100g).toBe(50);
        expect(res.body.id).toBe(id);
    });

    it("DELETE /products/:id - user deletes product", async () => {
        const res = await userAgent
            .delete(`/products/${id}`)

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
    });
});

describe("Validation and error handling", () => {
    it("POST /products - invalid numeric values", async () => {
        const res = await userAgent
            .post("/products")
            .send({
                name: "TestPOST",
                kcalPer100g: "abc",
                fatPer100g: 1,
                proteinPer100g: 1,
                carbsPer100g: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Brakuje nazwy lub kaloryczności produktu");
    });

    it("PUT /products/:id - invalid numeric values", async () => {
        const res = await userAgent
            .put(`/products/${id}`)
            .send({
                name: "TestPUT",
                kcalPer100g: "abc",
                fatPer100g: 1,
                proteinPer100g: 1,
                carbsPer100g: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Wartości muszą być liczbami");
    });

    it("POST /products - create without token", async () => {
        const productNameWithoutToken = `Test Product ${Date.now()}`;

        const res = await request(app)
            .post("/products")
            .send({
                name: productNameWithoutToken,
                kcalPer100g: 2500,
                fatPer100g: 100,
                proteinPer100g: 50,
                carbsPer100g: 300,
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Brak tokena, dostęp zabroniony");
    });

    it("DELETE /products/:id - deleting non-existing product", async () => {
        const res = await userAgent
            .delete("/products/999999")

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Produkt nie istnieje");
    });

    it("PUT /products/:id - updating non-existing product", async () => {
        const res = await userAgent
            .put("/products/999999")
            .send({
                name: "Test",
                kcalPer100g: 100,
                fatPer100g: 1,
                proteinPer100g: 1,
                carbsPer100g: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Produkt nie istnieje");
    });
});

describe("Global products permissions", () => {
    beforeAll(async () => {
        globalProductName = `Global Test Product ${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO products (name, kcal_per_100g, fat_per_100g, protein_per_100g, carbs_per_100g, user_id)
        VALUES ($1, 100, 10, 20, 30, null)
        RETURNING id`,
            [globalProductName]
        );

        globalProductId = result.rows[0].id;
        expect(globalProductId).toBeDefined();
    });

    it("PUT /products/:id - user can't edit global product", async () => {
        const res = await otherUserAgent
            .put(`/products/${globalProductId}`)
            .send({
                name: `${globalProductName} Updated`,
                kcalPer100g: 200,
                fatPer100g: 15,
                proteinPer100g: 25,
                carbsPer100g: 35,
            });

        expect(res.statusCode).toBe(403);
    });

    it("DELETE /products/:id - user can't delete global product", async () => {
        const res = await userAgent
            .delete(`/products/${globalProductId}`);

        expect(res.statusCode).toBe(403);
    });

    it("PUT /products/:id - admin can edit global product", async () => {
        const res = await adminAgent
            .put(`/products/${globalProductId}`)
            .send({
                name: `${globalProductName} Updated`,
                kcalPer100g: 200,
                fatPer100g: 15,
                proteinPer100g: 25,
                carbsPer100g: 35,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(`${globalProductName} Updated`);
        expect(res.body.kcalPer100g).toBe(200);
        expect(res.body.fatPer100g).toBe(15);
        expect(res.body.proteinPer100g).toBe(25);
        expect(res.body.carbsPer100g).toBe(35);
    });

    it("DELETE /products/:id - admin can delete global product", async () => {
        const res = await adminAgent
            .delete(`/products/${globalProductId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(globalProductId);
    });
});

describe("Product ownership and admin permissions", () => {
    it("POST /products - user creates product", async () => {
        productNameOwnership = `Test Product ${Date.now()}`;

        const res = await userAgent
            .post("/products")
            .send({
                name: productNameOwnership,
                kcalPer100g: 490,
                fatPer100g: 20,
                proteinPer100g: 25,
                carbsPer100g: 70,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(productNameOwnership);
        expect(res.body.kcalPer100g).toBe(490);
        expect(res.body.fatPer100g).toBe(20);
        expect(res.body.proteinPer100g).toBe(25);
        expect(res.body.carbsPer100g).toBe(70);

        id = res.body.id;
        expect(id).toBeDefined();

        const result = await pool.query(
            `SELECT user_id FROM products WHERE id = $1`,
            [id]
        );

        const userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            ["testowy@mail.com"]
        );

        expect(result.rows[0].user_id).toBe(userResult.rows[0].id);
        expect(res.body.userId).toBe(userResult.rows[0].id);
    });

    it("PUT /products/:id - other user cannot edit someone else's product", async () => {
        const res = await otherUserAgent
            .put(`/products/${id}`)
            .send({
                name: `${productNameOwnership} Updated`,
                kcalPer100g: 450,
                fatPer100g: 20,
                proteinPer100g: 15,
                carbsPer100g: 50,
            });

        expect(res.statusCode).toBe(403);
    });

    it("GET /products - product remains unchanged after unauthorized update", async () => {
        const res = await userAgent
            .get("/products");

        const product = res.body.find(p => p.id === id);

        expect(res.statusCode).toBe(200);
        expect(product).toBeDefined();

        expect(product.name).toBe(productNameOwnership);
        expect(product.kcalPer100g).toBe(490);
        expect(product.fatPer100g).toBe(20);
        expect(product.proteinPer100g).toBe(25);
        expect(product.carbsPer100g).toBe(70);
    });

    it("DELETE /products/:id - deleting someone's product", async () => {
        const res = await otherUserAgent
            .delete(`/products/${id}`);

        expect(res.statusCode).toBe(403);
    });

    it("PUT /products/:id - admin editing someone's product", async () => {
        const res = await adminAgent
            .put(`/products/${id}`)
            .send({
                name: `${productNameOwnership} Updated`,
                kcalPer100g: 450,
                fatPer100g: 20,
                proteinPer100g: 15,
                carbsPer100g: 50,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(`${productNameOwnership} Updated`);
        expect(res.body.kcalPer100g).toBe(450);
        expect(res.body.fatPer100g).toBe(20);
        expect(res.body.proteinPer100g).toBe(15);
        expect(res.body.carbsPer100g).toBe(50);
        expect(res.body.id).toBe(id);
    });

    it("DELETE /products/:id - admin deletes someone's product", async () => {
        const res = await adminAgent
            .delete(`/products/${id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
    });
});
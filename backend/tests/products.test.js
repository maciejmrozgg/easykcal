const request = require("supertest");
const app = require("../app");
const { loginOrRegister } = require("./helpers/auth");

let userToken;
let id;
let productName;

beforeAll(async () => {
    userToken = await loginOrRegister({
        email: "testowy@mail.com",
        password: "Testowe123!",
        role: "user",
    });
});

describe("Products API – CRUD", () => {
    it("GET /products - should return array", async () => {
        const res = await request(app)
            .get("/products")
            .set("Authorization", `Bearer ${userToken}`);

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

        const res = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${userToken}`)
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

    it("PUT /products/:id - user updates product", async () => {

        const res = await request(app)
            .put(`/products/${id}`)
            .set("Authorization", `Bearer ${userToken}`)
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
        const res = await request(app)
            .delete(`/products/${id}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
    });
});

describe("Validation and error handling", () => {
    it("POST /products - invalid numeric values", async () => {
        const res = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${userToken}`)
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
        const res = await request(app)
            .put(`/products/${id}`)
            .set("Authorization", `Bearer ${userToken}`)
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
        const res = await request(app)
            .delete("/products/999999")
            .set("Authorization", `Bearer ${userToken}`);
        
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Produkt nie istnieje");
    });

    it("PUT /products/:id - updating non-existing product", async () => {
        const res = await request(app)
            .put("/products/999999")
            .set("Authorization", `Bearer ${userToken}`)
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
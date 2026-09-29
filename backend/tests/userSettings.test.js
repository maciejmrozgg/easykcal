const request = require("supertest");
const app = require("../app");
const { loginOrRegister } = require("./helpers/auth");

let token;

beforeAll(async () => {
    token = await loginOrRegister({
        email: "userSettings@test.com",
        password: "Testowe123!",
    });
});

describe("User settings API", () => {
    it("GET /api/user-settings - return user settings", async () => {
        const res = await request(app)
            .get(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it("GET /api/user-settings - check if user settings fields exists", async () => {
        const res = await request(app)
            .get(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("goal");
        expect(res.body).toHaveProperty("calorie_target");
        expect(res.body).toHaveProperty("protein_target");
        expect(res.body).toHaveProperty("fat_target");
        expect(res.body).toHaveProperty("carbs_target");
        expect(res.body).toHaveProperty("copy_targets_to_new_months");
    });

    it("GET /api/user-settings - check if backend returns proper default values", async () => {
        const res = await request(app)
            .get(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.goal).toBe("maintenance");
        expect(res.body.calorie_target).toBe(null);
        expect(res.body.protein_target).toBe(null);
        expect(res.body.fat_target).toBe(null);
        expect(res.body.carbs_target).toBe(null);
        expect(res.body.copy_targets_to_new_months).toBe(true);
    });

    it("PATCH /api/user-settings - update user settings", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "mass",
                calorie_target: 2500,
                protein_target: 100,
                fat_target: 60,
                carbs_target: 270,
                copy_targets_to_new_months: false
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.goal).toBe("mass");
        expect(res.body.calorie_target).toBe(2500);
        expect(res.body.protein_target).toBe(100);
        expect(res.body.fat_target).toBe(60);
        expect(res.body.carbs_target).toBe(270);
        expect(res.body.copy_targets_to_new_months).toBe(false);
    });
});

describe("Validation user settings", () => {
    it("PATCH /api/user-settings - user goal", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "invalid"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wybierz prawidłowy cel żywieniowy");
    });

    it("PATCH /api/user-settings - copy targets to the new months type", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "mass",
                copy_targets_to_new_months: "false"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Niepoprawny typ");
    });

    it("PATCH /api/user-settings - all nutritions are null", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: null,
                protein_target: null,
                fat_target: null,
                carbs_target: null,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(200);
    });

    it("PATCH /api/user-settings - part of targets are null", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: null,
                protein_target: null,
                fat_target: 3,
                carbs_target: 4,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Proszę ustawić wszystkie cele żywieniowe");
    });

    it("PATCH /api/user-settings - all numbers are positive integers", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: 4,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(200);
    });

    it("PATCH /api/user-settings - one of target is negative integers", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: -1,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wprowadzono niepoprawne wartości dla celów żywieniowych");
    });

    it("PATCH /api/user-settings - one of target is 0", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: 0,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wprowadzono niepoprawne wartości dla celów żywieniowych");
    });

    it("PATCH /api/user-settings - one of the targets is non-integer value", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: 1.2,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wprowadzono niepoprawne wartości dla celów żywieniowych");
    });

    it("PATCH /api/user-settings - one of the targets is a string instead of a number", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: "string",
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wprowadzono niepoprawne wartości dla celów żywieniowych");
    });

    it("PATCH /api/user-settings - one of the targets is completely missing", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wprowadzono niepoprawne wartości dla celów żywieniowych");
    });

    it("PATCH /api/user-settings - goal is missing", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: 4,
                copy_targets_to_new_months: true
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Wybierz prawidłowy cel żywieniowy");
    });

    it("PATCH /api/user-settings - copy targets to the new months is missing", async () => {
        const res = await request(app)
            .patch(`/api/user-settings`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "maintenance",
                calorie_target: 1,
                protein_target: 2,
                fat_target: 3,
                carbs_target: 4,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toBe("Niepoprawny typ");
    });
});
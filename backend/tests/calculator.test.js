const request = require('supertest');
const app = require('../app');

//Calculator kcal -> g
describe('Calculator API', () => {
  test('POST /calculator/calculate should return correct calories', async () => {
    const res = await request(app)
      .post('/calculator/calculate')
      .send({ kcalPer100g: 200, weight: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toBe(100); // 200 * 50 / 100 = 100 kcal
  });
});

//Reverse calculator g -> kcal
describe('Calculator-reverse API', () => {
  test('POST /calculator/calculate-reverse should return correct grams', async () => {
    const res = await request(app)
      .post('/calculator/calculate-reverse')
      .send({ kcalPer100g: 200, calories: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('weight');
    expect(res.body.weight).toBe(25); // 50 * 100 / 200 = 25g
  });
});

//Calculator kcal -> g, wrong data type
describe('Calculator API filled with 1 wrong type field', () => {
  test('POST /calculator/calculate should return correct error message(400)', async () => {
    const res = await request(app)
      .post('/calculator/calculate')
      .send({ kcalPer100g: 200, weight: "abc" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Nieprawidłowa wartość kalorii lub wagi');
  });
});

//Calculator kcal -> g, 0 value
describe('Calculator API filled with 0 value in calories or/and weight', () => {
  test('POST /calculator/calculate should return correct error message', async () => {
    const res = await request(app)
      .post('/calculator/calculate')
      .send({ kcalPer100g: 0, weight: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Nieprawidłowa wartość kalorii lub wagi');
  });
});

//Reverse calculator g -> kcal, 0 value
describe('Calculator-reverse API filled with 0 value in calories or/and kcalPer100g', () => {
  test('POST /calculator/calculate-reverse should return correct error message', async () => {
    const res = await request(app)
      .post('/calculator/calculate-reverse')
      .send({ kcalPer100g: 0, calories: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Nieprawidłowa wartość kalorii lub wagi');
  });
});
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
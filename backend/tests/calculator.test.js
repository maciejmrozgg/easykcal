const request = require('supertest');
const app = require('../app');

describe('Calculator API', () => {
  test('POST /calculator/calculate should return correct calories', async () => {
    const res = await request(app)
      .post('/calculator/calculate')
      .send({ kcalPer100g: 200, weight: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toBe(100); // 200 * 50 / 100
  });
});
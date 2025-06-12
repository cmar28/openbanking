const request = require('supertest');

// Reset modules before each test so env vars are re-evaluated
beforeEach(() => {
  jest.resetModules();
});

describe('API endpoints without token', () => {
  test('/api/accounts returns 500 when token missing', async () => {
    process.env.STARLING_PERSONAL_TOKEN = '';
    const app = require('../index');
    const res = await request(app).get('/api/accounts');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('STARLING_PERSONAL_TOKEN not set');
  });

  test('/api/accounts/:uid/transactions returns 500 when token missing', async () => {
    process.env.STARLING_PERSONAL_TOKEN = '';
    const app = require('../index');
    const res = await request(app).get('/api/accounts/testuid/transactions');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('STARLING_PERSONAL_TOKEN not set');
  });
});

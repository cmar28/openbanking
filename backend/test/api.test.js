const request = require('supertest');
jest.mock('node-fetch', () => jest.fn());
let fetch;

// Reset modules before each test so env vars are re-evaluated
beforeEach(() => {
  jest.resetModules();
  fetch = require('node-fetch');
  fetch.mockReset();
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

describe('transactions endpoint', () => {
  test('returns empty transactions when Starling responds with empty body', async () => {
    process.env.STARLING_PERSONAL_TOKEN = 'test-token';
    fetch.mockResolvedValueOnce({ text: () => Promise.resolve('') });
    const app = require('../index');
    const res = await request(app).get('/api/accounts/acc123/transactions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ transactions: [] });
  });
});

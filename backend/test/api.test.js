const request = require('supertest');
let originalToken;

beforeEach(() => {
  originalToken = process.env.STARLING_PERSONAL_TOKEN;
  jest.resetModules();
});

afterEach(() => {
  process.env.STARLING_PERSONAL_TOKEN = originalToken;
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
  jest.setTimeout(20000);
  test('returns transactions array', async () => {
    if (!process.env.STARLING_PERSONAL_TOKEN) {
      throw new Error('STARLING_PERSONAL_TOKEN not provided');
    }
    const app = require('../index');
    const accountsRes = await request(app).get('/api/accounts');
    const uid = accountsRes.body.accounts[0].accountUid;
    const res = await request(app).get(`/api/accounts/${uid}/transactions`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });
});

const request = require('supertest');

beforeEach(() => {
  jest.resetModules();
});

describe('API endpoints with token', () => {
  jest.setTimeout(20000);

  test('/api/accounts returns data when token is set', async () => {
    if (!process.env.STARLING_PERSONAL_TOKEN) {
      throw new Error('STARLING_PERSONAL_TOKEN not provided');
    }

    const app = require('../index');
    const res = await request(app).get('/api/accounts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.accounts)).toBe(true);
  });

  test('/api/accounts/:uid/transactions proxies data', async () => {
    if (!process.env.STARLING_PERSONAL_TOKEN) {
      throw new Error('STARLING_PERSONAL_TOKEN not provided');
    }

    const app = require('../index');
    const accountsRes = await request(app).get('/api/accounts');
    const firstUid = accountsRes.body.accounts[0].accountUid;
    const res = await request(app).get(`/api/accounts/${firstUid}/transactions`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });
});

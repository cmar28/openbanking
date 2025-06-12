const request = require('supertest');

jest.mock('node-fetch', () => jest.fn());
let fetch;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  fetch = require("node-fetch");
  fetch.mockReset();
});

describe('API endpoints with token', () => {
  test('/api/accounts returns data when token is set', async () => {
    process.env.STARLING_PERSONAL_TOKEN = 'testtoken';
    const sampleAccounts = { accounts: [{ uid: '123', name: 'Test Account' }] };
    fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(sampleAccounts) });

    const app = require('../index');
    const res = await request(app).get('/api/accounts');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://api.starlingbank.com/api/v2/accounts', {
      headers: {
        Authorization: `Bearer testtoken`,
        'User-Agent': 'openbanking-demo'
      }
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleAccounts);
  });

  test('/api/accounts/:uid/transactions proxies data', async () => {
    process.env.STARLING_PERSONAL_TOKEN = 'testtoken';
    const sampleTx = { transactions: [{ feedItemUid: 'tx1' }] };
    fetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(sampleTx) });

    const app = require('../index');
    const res = await request(app).get('/api/accounts/testuid/transactions');

    expect(fetch).toHaveBeenCalledTimes(1);
    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toMatch(/https:\/\/api.starlingbank.com\/api\/v2\/transactions\/account\/testuid\/settled-transactions\?from=/);
    expect(fetch.mock.calls[0][1].headers).toEqual({
      Authorization: `Bearer testtoken`,
      'User-Agent': 'openbanking-demo'
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleTx);
  });
});

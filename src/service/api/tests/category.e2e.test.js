"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const getMockData = require(`../../lib/get-mock-data`);

describe(`Categories API end-to-end tests`, () => {
  let server;
  let mockData;

  beforeAll(async () => {
    mockData = await getMockData();
    server = getServer(mockData);
  });

  test(`When get categories status code should be 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/categories`);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

});

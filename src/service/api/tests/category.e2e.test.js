"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const getMockData = require(`../../lib/get-mock-data`);

let server;
let mockData;

beforeAll(async () => {
  mockData = await getMockData();
  server = getServer(mockData);
});

describe(`Categories API end-to-end tests`, () => {
  test(`When get categories status code should be 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/categories`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });
  test(`When get categories array should be returned`, async () => {
    const res = await request(server).get(`${API_PREFIX}/categories`);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

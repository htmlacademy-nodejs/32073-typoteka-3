"use strict";

let request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../../lib/init-db`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const mockCategories = require(`./mocks/categories.mock.json`);
const mockArticles = require(`./mocks/articles.mock.json`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

describe(`Categories API end-to-end tests`, () => {
  let server;

  beforeAll(async () => {
    await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
    server = getServer(mockDB);
  });

  test(`When get categories status code should be 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/categories`);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

});

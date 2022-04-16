"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const Sequelize = require(`sequelize`);
const initDB = require(`../../lib/init-db`);
const mockCategories = require(`./mocks/categories.mock.json`);
const mockArticles = require(`./mocks/articles.mock.json`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
let server;

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  server = getServer(mockDB);
});

describe(`Search API end-to-end tests`, () => {

  test(`Article has correct title`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({query: mockArticles[0].title});
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body[0].title).toBe(mockArticles[0].title);
  });

  test(`Get empty articles array with status code 404`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({query: `Тестовый текст поиска статьи`});
    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(res.body.length).toBe(0);
  });

  test(`Get found articles array with status code 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({query: mockArticles[0].title});

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`Search ends with status code 400 if query string is empty`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({param: ``});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

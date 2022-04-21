"use strict";

let request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../../lib/init-db`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const mockCategories = require(`./mocks/categories.mock.json`);
const mockArticles = require(`./mocks/articles.mock.json`);
const passwordUtils = require(`../../lib/password`);


const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

describe(`Categories API end-to-end tests`, () => {
  let server;

  beforeAll(async () => {
    await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
    server = getServer(mockDB);
  });

  test(`When get categories status code should be 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/categories`);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

});

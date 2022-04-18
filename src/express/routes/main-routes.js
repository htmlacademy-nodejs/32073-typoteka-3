"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true) // опциональный аргумент
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const results = await api.search(search);

    res.render(`search`, {
      results,
      searchText: search,
    });
  } catch (error) {
    res.render(`search`, {
      results: [],
      searchText: search,
    });
  }
});
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  return res.render(`all-categories`, {categories});
});

module.exports = mainRouter;

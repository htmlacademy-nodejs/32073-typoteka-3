"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true) // опциональный аргумент
  ]);

  res.render(`main`, {articles, categories});
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

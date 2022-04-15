"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`main`, {articles});
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
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;

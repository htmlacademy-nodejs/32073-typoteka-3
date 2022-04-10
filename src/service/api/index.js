'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const getRoutes = (mockData) => {
  const app = new Router();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());

  return app;
};

module.exports = {getRoutes};


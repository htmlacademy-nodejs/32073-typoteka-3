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

const getRoutes = (db) => {
  const app = new Router();

  category(app, new CategoryService(db));
  search(app, new SearchService(db));
  article(app, new ArticleService(db), new CommentService(db));

  return app;
};

module.exports = {getRoutes};


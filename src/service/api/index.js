'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const comment = require(`../api/comment`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service`);

const getRoutes = (db) => {
  const app = new Router();

  category(app, new CategoryService(db));
  search(app, new SearchService(db));
  article(app, new ArticleService(db), new CommentService(db));
  user(app, new UserService(db));
  comment(app, new CommentService(db));

  return app;
};

module.exports = {getRoutes};


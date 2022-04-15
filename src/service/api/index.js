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

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);


const getRoutes = () => {
  const app = new Router();

  const sequelize = getSequelize();
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));

  return app;
};

module.exports = {getRoutes};


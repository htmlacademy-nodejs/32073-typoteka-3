"use strict";

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const {auth} = require(`../middlewares`);

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles, user});
});

module.exports = myRouter;

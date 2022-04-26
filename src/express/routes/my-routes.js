"use strict";

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const {authAdmin} = require(`../middlewares`);
const {prepareErrors} = require(`../../utils`);

const csrf = require(`csurf`);
const csrfProtection = csrf();

myRouter.get(`/`, authAdmin, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({withComments: false});
  res.render(`my`, {articles, user});
});

myRouter.post(`/`, authAdmin, async (req, res, next) => {
  const {articleId} = req.body;

  try {
    await api.deleteArticle(articleId);
    res.redirect(`/my`);
  } catch (error) {
    next(error);
  }
});

myRouter.get(`/comments`, authAdmin, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({withComments: true});
  res.render(`comments`, {articles, user});
});

myRouter.get(`/categories`, authAdmin, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories({count: true});
    res.render(`all-categories`, {categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    next(error);
  }
});

myRouter.post(`/categories/add`, authAdmin, csrfProtection, async (req, res) => {
  const {category} = req.body;

  try {
    await api.createCategory({name: category});

    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({count: true});
    res.render(`all-categories`, {categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

myRouter.post(`/categories/:id`, authAdmin, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {deleteCategory, category} = req.body;

  try {
    if (deleteCategory) {
      await api.deleteCategory(id);
    } else {
      await api.editCategory(id, {name: category});
    }
    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({count: true});
    res.render(`all-categories`, {categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

myRouter.post(`/comments/delete/:id`, authAdmin, async (req, res, next) => {
  const {id} = req.params;

  try {
    await api.deleteComment(id);
    return res.redirect(`/my/comments`);
  } catch (error) {
    return next(error);
  }
});

module.exports = myRouter;

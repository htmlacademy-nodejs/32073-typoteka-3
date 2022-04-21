"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const {auth, upload} = require(`../middlewares`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const {ensureArray, prepareErrors} = require(`../../utils`);

articlesRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  res.render(`articles-by-category`, {user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const categories = await api.getCategories();
  return res.render(`new-post`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const {id} = req.params;
  const article = await api.getArticle(id, {needComments: true});
  return res.render(`post`, {article, user, id, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res, _next) => {
  const {user} = req.session;

  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`edit-post`, {article, categories, user, csrfToken: req.csrfToken()});
  } catch (err) {
    return res.status(HttpCode.NOT_FOUND)
      .render(`404`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;

  try {
    const articleData = {
      announce: body.announce,
      categories: ensureArray(body.categories),
      fullText: body[`full-text`],
      picture: file ? file.filename : body[`old-image`],
      title: body.title,
      userId: user.id,
    };
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`edit-post`, {article, user, categories, validationMessages});
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;

  const newArticle = {
    announce: body.announcement,
    categories: ensureArray(body.categories),
    fullText: body[`full_text`],
    image: file ? file.filename : ``,
    title: body.title,
    userId: user.id,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`new-post`, {categories, validationMessages, user});
  }
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/article/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await await api.getArticle(id);
    res.render(`post`, {article, id, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;

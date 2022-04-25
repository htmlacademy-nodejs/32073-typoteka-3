"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const {upload, authAdmin} = require(`../middlewares`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const truncate = require(`../../service/lib/truncate`);

const {ensureArray, prepareErrors} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;
const ANNOUNCE_MAX_LENGTH = 55;

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const id = +req.params.id;
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories,
  ] = await Promise.all([
    api.getArticles({offset, limit, categoryId: id, withComments: true}),
    api.getCategories(true), // опциональный аргумент
  ]);

  const category = categories.find((cat) => cat.id === id);
  const truncateAnnounce = (announce) => truncate(announce, ANNOUNCE_MAX_LENGTH);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`articles-by-category`, {articles, page, totalPages, categories, category, user, truncateAnnounce});
});

articlesRouter.get(`/add`, authAdmin, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const categories = await api.getCategories();
  return res.render(`new-post`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const {id} = req.params;
  const [
    article,
    categories,
  ] = await Promise.all([
    api.getArticle(id, {needComments: true}),
    api.getCategories(true), // опциональный аргумент
  ]);

  return res.render(`post`, {article, categories, user, id, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/edit/:id`, authAdmin, csrfProtection, async (req, res, _next) => {
  const {user} = req.session;

  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id, {needComments: false}),
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
      api.getArticle(id, {needComments: false}),
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
    res.render(`new-post`, {categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [
      article,
      categories,
    ] = await Promise.all([
      api.getArticle(id, {needComments: true}),
      api.getCategories(true), // опциональный аргумент
    ]);
    res.render(`post`, {article, categories, id, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;

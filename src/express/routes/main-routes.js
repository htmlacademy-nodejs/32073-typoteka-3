"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const {upload} = require(`../middlewares`);
const truncate = require(`../../service/lib/truncate`);
const {prepareErrors} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;
const HOT_ARTICLES_NUMBER = 4;
const LAST_COMMENTS_NUMBER = 4;
const ANNOUNCE_MAX_LENGTH = 55;


mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    hotArticles,
    categories,
    lastComments,
  ] = await Promise.all([
    api.getArticles({offset, limit, withComments: true}),
    api.getArticles({onlyHot: true, limit: HOT_ARTICLES_NUMBER}),
    api.getCategories(true), // опциональный аргумент
    api.getComments({onlyLast: true, limit: LAST_COMMENTS_NUMBER})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const truncateAnnounce = (announce) => truncate(announce, ANNOUNCE_MAX_LENGTH);

  res.render(`main`, {articles, hotArticles, page, totalPages, categories, lastComments, user, truncateAnnounce});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;

  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: `${body[`name`]} ${body[`surname`]}`,
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => res.redirect(`/login`));
});

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


module.exports = mainRouter;

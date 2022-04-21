"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

const {prepareErrors} = require(`../../utils`);

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true) // опциональный аргумент
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories});
});

mainRouter.get(`/register`, (req, res) => {
  // const {user} = req.session;
  // console.log(`user`, user);
  res.render(`sign-up`);
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  console.log(`body`, body);
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
    // const {user} = req.session;
    res.render(`sign-up`, {validationMessages});
  }
});

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
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  return res.render(`all-categories`, {categories});
});

module.exports = mainRouter;

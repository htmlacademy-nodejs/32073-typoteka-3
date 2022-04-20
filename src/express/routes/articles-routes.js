"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const UPLOAD_DIR = `../upload/img/`;
const {ensureArray, prepareErrors} = require(`../../utils`);

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  return res.render(`post`, {article});
});

articlesRouter.get(`/edit/:id`, async (req, res, _next) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`edit-post`, {article, categories});
  } catch (err) {
    return res.status(HttpCode.NOT_FOUND)
      .render(`404`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    announce: body.announcement,
    categories: ensureArray(body.categories),
    fullText: body[`full-text`],
    picture: file ? file.filename : body[`old-image`],
    title: body.title,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`articles/edit-post`, {article, categories, validationMessages});
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticle = {
    announce: body.announcement,
    category: ensureArray(body.categories),
    createdDate: body.date,
    fullText: body[`full_text`],
    picture: file ? file.filename : ``,
    title: body.title,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.redirect(`articles/new-post`, {categories, validationMessages});
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/article/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await await api.getArticle(id);
    res.render(`articles/post`, {article, id, validationMessages});
  }
});

module.exports = articlesRouter;

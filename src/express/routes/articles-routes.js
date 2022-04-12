"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const UPLOAD_DIR = `../upload/img/`;
const {ensureArray} = require(`../../utils`);

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
  const [categories] = await Promise.all([
    api.getCategories()
  ]);
  res.render(`new-post`, {categories});
});

articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

articlesRouter.get(`/edit/:id`, async (req, res, _next) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`edit-post`, {article, categories});
  } catch (err) {
    console.log(`err:`, err);
    return res.status(HttpCode.NOT_FOUND)
      .render(`404`);
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
  } catch (e) {
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;

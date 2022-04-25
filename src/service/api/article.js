'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, userId, categoryId, withComments, onlyHot = false} = req.query;

    let result;

    if (onlyHot) {
      result = await articleService.findHot({limit});
      return res.status(HttpCode.OK).json(result);
    }

    if (userId) {
      result = await articleService.findAll({userId, withComments});
      return res.status(HttpCode.OK).json(result);
    }

    if (categoryId) {
      result = await articleService.findPage({limit, offset, categoryId, withComments});
    } else if (limit || offset) {
      result = await articleService.findPage({withComments, limit, offset});
    } else {
      result = await articleService.findAll(withComments);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {needComments = true} = req.query;
    const article = await articleService.findOne(articleId, needComments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, routeParamsValidator, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const existsArticle = await articleService.findOne(articleId);

    if (!existsArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, routeParamsValidator, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);
    res.status(HttpCode.OK)
      .json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, routeParamsValidator, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};

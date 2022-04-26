'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentExists = require(`../middlewares/comment-exists`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const route = new Router();

module.exports = (app, commentService) => {
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {onlyLast = false, limit = false, userId = null} = req.query;
    let comments = [];

    if (onlyLast) {
      comments = await commentService.findLast(limit);
    } else {
      comments = await commentService.findAll({limit, userId});
    }

    return res.status(HttpCode.OK).json(comments);
  });


  route.delete(`/:commentId`, [commentExists(commentService), routeParamsValidator], async (req, res) => {
    const {commentId} = req.params;

    const dropedComment = await commentService.drop(commentId);

    return res.status(HttpCode.OK).json(dropedComment);
  });
};

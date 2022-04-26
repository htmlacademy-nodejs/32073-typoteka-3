'use strict';

const Aliase = require(`../models/aliase`);
const truncate = require(`../lib/truncate`);
class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async findOne(id) {
    const comment = await this._Comment.findByPk(id);
    if (comment) {
      return comment.get({plain: true});
    }
    return comment;
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll({articleId = null, limit = null, userId = null} = {}) {
    const options = {
      include: [{
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }],
      order: [[`createdAt`, `desc`]]
    };

    if (articleId) {
      options.where = {ArticleId: articleId};
    }

    if (userId) {
      options.include.push({
        model: this._User,
        as: Aliase.USERS,
        attributes: [`avatar`, `name`]
      });
      options.where = {userId};
    }

    if (limit) {
      options.limit = limit;
    } else {
      options.include.push({
        model: this._Article,
        as: Aliase.ARTICLES,
        attributes: [`title`]
      });
    }

    return this._Comment.findAll(options);
  }

  async findLast(limit) {
    const comments = await this.findAll({limit});

    return comments.map((item) => {
      const comment = item.get();
      comment.truncatedText = truncate(comment.text);
      return comment;
    });

  }

}

module.exports = CommentService;

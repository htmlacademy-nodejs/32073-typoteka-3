'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineUser = require(`./user`);
const ALIASES = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: ALIASES.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: ALIASES.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: ALIASES.ARTICLES});
  Category.hasMany(ArticleCategory, {as: ALIASES.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: ALIASES.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: ALIASES.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: ALIASES.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: ALIASES.USERS, foreignKey: `userId`});

  return {Article, ArticleCategory, Category, Comment, User};
};

module.exports = define;

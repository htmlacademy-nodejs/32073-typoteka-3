'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const ALIASES = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);

  Article.hasMany(Comment, {as: ALIASES.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: ALIASES.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: ALIASES.ARTICLES});
  Category.hasMany(ArticleCategory, {as: ALIASES.ARTICLE_CATEGORIES});

  return {Article, ArticleCategory, Category, Comment};
};

module.exports = define;

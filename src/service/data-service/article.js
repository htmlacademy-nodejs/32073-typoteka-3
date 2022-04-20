'use strict';

const Aliase = require(`../models/aliase`);
const Sequelize = require(`sequelize`);
class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    // await article.addCategories(articleData.categories);
    const categories = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(
              `COUNT`,
              `*`
          ),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: []
      }]
    });
    console.log(`categories`, categories);
    await article.addCategories([`Железо`]);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findOne(id) {
    return this._Article.findByPk(id, {include: [Aliase.CATEGORIES, Aliase.COMMENTS]});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findPage({comments, limit, offset}) {
    const include = [Aliase.CATEGORIES];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

}

module.exports = ArticleService;

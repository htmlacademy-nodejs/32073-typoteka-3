'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, offer) => {
      acc.add(...offer.category);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;

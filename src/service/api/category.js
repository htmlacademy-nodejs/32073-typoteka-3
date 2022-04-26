'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryExists = require(`../middlewares/category-exists`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const categories = await service.findOne(id);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);

    res.status(HttpCode.OK).json(category);
  });

  route.put(`/:categoryId`, categoryValidator, async (req, res) => {
    const {categoryId} = req.params;
    const updated = await service.update(categoryId, req.body);

    res.status(HttpCode.OK).json(updated);
  });

  route.delete(`/:categoryId`, [categoryExists(service), routeParamsValidator], async (req, res) => {
    const {categoryId} = req.params;

    const dropedCategory = await service.drop(categoryId);

    return res.status(HttpCode.OK).json(dropedCategory);
  });
};

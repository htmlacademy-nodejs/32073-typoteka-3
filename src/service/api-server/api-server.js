'use strict';

const express = require(`express`);
const {getLogger} = require(`../lib/logger`);
const expressPinoLogger = require(`express-pino-logger`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getRoutes} = require(`../api`);

const getServer = async (mockData) => {
  const routes = getRoutes(mockData);
  const server = express();
  const logger = getLogger();

  server.use(expressPinoLogger({logger}));
  server.use(express.json());

  server.use((req, res, next) => {
    logger.debug(`Started request to url ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });

  server.use(API_PREFIX, routes);

  server.use((req, res) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  server.use((err, _req, _res, _next) => {
    logger.error(`An error occured on processing request: ${err.message}`);
  });


  return server;
};

module.exports = {getServer};


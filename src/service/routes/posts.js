'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  MOCK_FILE_PATH,
  HttpCode,
  ErrorCode
} = require(`../../constants`);

const {Router} = require(`express`);

const postsRouter = new Router();

postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(MOCK_FILE_PATH);

    res.json(JSON.parse(fileContent));
  } catch (error) {
    if (error.code === ErrorCode.NO_FILE_OR_DIRECTORY) {
      res.statusCode(HttpCode.NOT_FOUND).send(`There is no data file`);
    } else {
      res.statusCode(HttpCode.INTERNAL_ERROR).send(`Internal error`);
    }

    console.info(chalk.red(error));
  }
});

module.exports = postsRouter;

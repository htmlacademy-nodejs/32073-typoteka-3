"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const getMockData = require(`../lib/get-mock-data`);
const routes = require(`../api`);
const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;
    try {
      await getMockData();

      app.listen(port, (error) => {
        if (error) {
          console.info(chalk.green(`Ошибка при запуске сервера`, error));
        }

        console.info(chalk.green(`Ожидаю соединений на порт ${port}`));
      });
    } catch (err) {
      console.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }
  },
};

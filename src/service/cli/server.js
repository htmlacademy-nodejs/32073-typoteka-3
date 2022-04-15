'use strict';

const {getServer} = require(`../api-server`);
const {getLogger} = require(`../lib/logger`);
const {ExitCode} = require(`../../constants`);
const getMockData = require(`../lib/get-mock-data`);
const sequelize = require(`../lib/sequelize`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const logger = getLogger({name: `api`});

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured while connecting to a database: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      const mockData = await getMockData();
      const server = await getServer(mockData);

      server.listen(port, (err) => {
        if (err) {
          logger.error(`An error occured on server creation: ${err.message}`);
        }

        logger.info(`Server is running on port: ${port}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`, err);
      process.exit(ExitCode.ERROR);
    }
  }
};

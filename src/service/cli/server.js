'use strict';

const {getServer} = require(`../api-server`);
const {getLogger} = require(`../lib/logger`);
const {ExitCode} = require(`../../constants`);
const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const sequelize = getSequelize();
    const logger = getLogger({name: `api`});

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured while connecting to a database: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      defineModels(sequelize);
      const server = await getServer(sequelize);

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

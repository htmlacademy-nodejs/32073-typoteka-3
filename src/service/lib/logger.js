'use strict';

const path = require(`path`);
const fs = require(`fs`);
const logsDirectory = path.resolve(__dirname, `../logs/`);
const isDevMode = process.env.NODE_ENV === `development`;
const pino = require(`pino`);

let streams = [
  {level: `debug`, stream: fs.createWriteStream(`${logsDirectory}/app.txt`)},
  {level: `error`, stream: fs.createWriteStream(`${logsDirectory}/errors.txt`)}
];

if (isDevMode) {
  streams = streams.concat([
    {level: `debug`, stream: process.stdout},
    {level: `error`, stream: process.stderr}
  ]);
}

const logger = pino({
  name: `pino-and-express`,
  level: process.env.LOG_LEVEL || `info`,
  transport: {
    target: `pino-pretty`,
    options: {
      colorize: true
    }
  },
}, require(`pino-multi-stream`).multistream(streams));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};

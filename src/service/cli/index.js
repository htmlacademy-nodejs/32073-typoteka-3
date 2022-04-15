'use strict';

const help = require(`./help`);
const filldb = require(`./filldb`);
const fill = require(`./fill`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [filldb.name]: filldb,
  [fill.name]: fill,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli,
};

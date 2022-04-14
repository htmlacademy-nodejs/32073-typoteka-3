'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [generate.name]: generate,
  [fill.name]: fill,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli,
};

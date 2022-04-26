'use strict';

const auth = require(`./auth`);
const authAdmin = require(`./authAdmin`);
const upload = require(`./upload`);

module.exports = {
  auth,
  authAdmin,
  upload,
};

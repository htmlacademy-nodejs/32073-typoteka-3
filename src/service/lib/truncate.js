'use strict';

const truncate = require(`lodash.truncate`);

const DEFAULT_MAXLENGTH = 100;

module.exports = (text, length = DEFAULT_MAXLENGTH) => truncate(text, {
  length,
  separator: /[.,?!]?\s+/,
  omission: `…`
});

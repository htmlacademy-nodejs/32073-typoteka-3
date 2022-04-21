'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const getSequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const sequelize = getSequelize();

const {
  ExitCode,
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const ANNOUNCE_SENTENCES_RESTRICT = {
  min: 1,
  max: 3,
};

const FULLTEXT_SENTENCES_RESTRICT = {
  min: 1,
  max: 5,
};

const DATE_MONTHS_RANGE = 2;

const logger = getLogger({name: `filldb`});


const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateDate = (dateMonthsRange) => {
  const currentDate = new Date();
  const minDate = (new Date(currentDate.getTime())).setMonth(currentDate.getMonth() - dateMonthsRange);
  return new Date(getRandomInt(+minDate, +currentDate));
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateImage = (images) => images[getRandomInt(0, images.length - 1)];

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateArticles = (count, titles, categories, images, sentences, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(ANNOUNCE_SENTENCES_RESTRICT.min, ANNOUNCE_SENTENCES_RESTRICT.max).join(` `),
    image: generateImage(images),
    fullText: shuffle(sentences).slice(FULLTEXT_SENTENCES_RESTRICT.min, FULLTEXT_SENTENCES_RESTRICT.max).join(` `),
    createdDate: generateDate(DATE_MONTHS_RANGE),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred while connecting to database: ${err.message}`);
      process.exit(ExitCode);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const images = await readContent(FILE_IMAGES_PATH);

    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar01.jpg`
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.jpg`
      }
    ];

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticles, titles, categories, images, sentences, comments, users);

    return initDatabase(sequelize, {categories, articles, users});
  }
};

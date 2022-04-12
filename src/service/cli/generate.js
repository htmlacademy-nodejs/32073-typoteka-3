'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {
  ExitCode,
  MAX_ID_LENGTH,
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const ANNOUNCE_SENTENCES_RESTRICT = {
  min: 1,
  max: 5,
};

const CATEGORIES_RESTRICT = {
  min: 1,
  max: 3,
};

const DATE_MONTHS_RANGE = 2;

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
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateImage = (images) => images[getRandomInt(0, images.length - 1)];

const generateArticles = (count, titles, categories, images, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(ANNOUNCE_SENTENCES_RESTRICT.min, ANNOUNCE_SENTENCES_RESTRICT.max).join(` `),
    image: generateImage(images),
    fullText: shuffle(sentences).slice(getRandomInt(0, sentences.length - 1)).join(` `),
    createdDate: generateDate(DATE_MONTHS_RANGE),
    category: shuffle(categories).slice(CATEGORIES_RESTRICT.min, CATEGORIES_RESTRICT.max),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    if (count > 1000) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const images = await readContent(FILE_IMAGES_PATH);

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticles, titles, categories, images, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Файл mocks.json c тестовыми данными успешно создан.`));
    } catch (err) {
      console.error(chalk.red(`Ошибка записи данных в файл...`));
    }
  }
};

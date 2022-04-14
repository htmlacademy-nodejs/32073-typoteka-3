'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  ExitCode,
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_IMAGES_PATH = `./data/images.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const ANNOUNCE_SENTENCES_RESTRICT = {
  min: 1,
  max: 5,
};

const DATE_MONTHS_RANGE = 2;

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];


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

function getUserId(usersCount) {
  return getRandomInt(1, usersCount);
}


const generateComments = (articleId, count, comments, usersCount) => (
  Array(count).fill({}).map(() => ({
    userId: getUserId(usersCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateImage = (images) => images[getRandomInt(0, images.length - 1)];

const generateArticles = (count, titles, categoriesCount, images, sentences, comments, usersCount) => (
  Array(count).fill({}).map((_, articleIdx) => ({
    id: articleIdx + 1,
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(ANNOUNCE_SENTENCES_RESTRICT.min, ANNOUNCE_SENTENCES_RESTRICT.max).join(` `),
    image: generateImage(images),
    fullText: shuffle(sentences).slice(getRandomInt(0, sentences.length - 1)).join(` `),
    createdDate: generateDate(DATE_MONTHS_RANGE),
    category: [getRandomInt(1, categoriesCount)],
    comments: generateComments(articleIdx + 1, getRandomInt(1, MAX_COMMENTS), comments, usersCount),
    userId: getUserId(usersCount),
  }))
);

module.exports = {
  name: `--fill`,
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
    const articles = generateArticles(countArticles, titles, categories.length, images, sentences, comments, users.length);
    const articleComments = articles.flatMap((article) => article.comments);
    const articlesCategories = articles.map((article, idx) => ({articleId: idx + 1, categoryId: article.category[0]}));

    const categoriesValues = categories.map((name) => `('${name}')`).join(`,\n\t`);
    const usersValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n\t`);
    const articlesValues = articles.map(({title, announce, fullText, image, userId}) =>
      `('${title}', '${announce}', '${fullText}', '${image}', ${userId})`
    ).join(`,\n\t`);
    const commentsValues = articleComments.map(({text, userId, articleId}) => `(${articleId}, ${userId}, '${text}')`).join(`,\n\t`);
    const articlesCategoriesValues = articlesCategories.map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`).join(`,\n\t`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
  ${usersValues};
INSERT INTO categories(name) VALUES
  ${categoriesValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, image, user_id) VALUES
  ${articlesValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
  ${articlesCategoriesValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
  ${commentsValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Файл fill-db.sql для заполнения базы тестовыми данными успешно создан.`));
    } catch (err) {
      console.error(chalk.red(`Ошибка записи данных в файл...`));
    }
  }
};

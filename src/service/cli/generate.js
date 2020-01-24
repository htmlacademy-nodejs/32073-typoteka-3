'use strict';

const fs = require(`fs`);

const {
  ExitCode
} = require(`../../constants`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const ANNOUNCE_SENTENCES_RESTRICT = {
  min: 1,
  max: 5,
};

const CATEGORIES_RESTRICT = {
  min: 1,
  max: 3,
};

const DATE_MONTHS_RANGE = 2;

const generateDate = (dateMonthsRange) => {
  const currentDate = new Date();
  const minDate = (new Date(currentDate.getTime())).setMonth(currentDate.getMonth() - dateMonthsRange);
  return new Date(getRandomInt(+minDate, +currentDate));
};

const generateArticles = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: shuffle(SENTENCES).slice(ANNOUNCE_SENTENCES_RESTRICT.min, ANNOUNCE_SENTENCES_RESTRICT.max).join(` `),
    fullText: shuffle(SENTENCES).slice(getRandomInt(0, SENTENCES.length - 1)).join(` `),
    createdDate: generateDate(DATE_MONTHS_RANGE),
    category: shuffle(CATEGORIES).slice(CATEGORIES_RESTRICT.min, CATEGORIES_RESTRICT.max),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    if (count > 1000) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticles));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Ошибка записи данных в файл...`);
        return process.exit(ExitCode.error);
      }
      console.log(`Файл mocks.json c тестовыми публикациями успешно создан.`);
      return process.exit(ExitCode.success);
    });

  }
};

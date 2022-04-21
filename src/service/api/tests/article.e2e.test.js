"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const Sequelize = require(`sequelize`);
const initDB = require(`../../lib/init-db`);
const mockCategories = require(`./mocks/categories.mock.json`);
const mockArticles = require(`./mocks/articles.mock.json`);
const passwordUtils = require(`../../lib/password`);

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  return getServer(mockDB);
};

describe(`API returns a list of all articles`, () => {
  let response;
  let server;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .get(`${API_PREFIX}/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of articles which length equals mockData length`, () => expect(response.body.length).toBe(mockArticles.length));

  test(`First article's title equals "Обзор новейшего смартфона"`, () => {
    return expect(response.body.sort((a, b) => a.id - b.id)[0].title).toBe(`Обзор новейшего смартфона`);
  });
});

describe(`API returns an article with given id`, () => {
  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .get(`${API_PREFIX}/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Обзор новейшего смартфона"`, () => expect(response.body.title).toBe(`Обзор новейшего смартфона`));
});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    "userId": 1,
    "categories": [1, 2],
    "title": `Обзор новейшего смартфона и что-то еще тут, подходящее по длине, созданный`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
  };

  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .post(`${API_PREFIX}/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count has been changed`, () => request(server)
    .get(`${API_PREFIX}/articles`)
    .expect((res) => expect(res.body.length).toBe(mockArticles.length + 1))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    "userId": 1,
    "title": `Обзор новейшего смартфона`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "categories": [1, 2],
  };

  let server;

  beforeAll(async ()=> {
    server = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(server)
        .post(`${API_PREFIX}/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, categories: `true`},
      {...newArticle, image: 12345},
      {...newArticle, categories: `Котики`}
    ];
    for (const badArticle of badArticles) {
      await request(server)
        .post(`${API_PREFIX}/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: `too short`},
      {...newArticle, announce: `too short`},
      {...newArticle, categories: []}
    ];
    for (const badArticle of badArticles) {
      await request(server)
        .post(`${API_PREFIX}/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "userId": 1,
    "title": `Обзор новейшего смартфона и что-то еще тут, подходящее по длине, изменен`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "categories": [1, 2],
  };

  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .put(`${API_PREFIX}/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));


  test(`Article is really changed`, () => request(server)
    .get(`${API_PREFIX}/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Обзор новейшего смартфона и что-то еще тут, подходящее по длине, изменен`))
  );

});

describe(`API works correctly when trying to change an article in a wrong way`, () => {
  let server;

  beforeAll(async () => {
    server = await createAPI();
  });

  test(`API returns status code 404 when trying to change non-existent article`, () => {

    const validArticle = {
      "userId": 1,
      "title": `Обзор новейшего смартфона и что-то еще тут, подходящее по длине, изменен`,
      "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно.`,
      "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
      "categories": [1, 2],
    };

    return request(server)
      .put(`${API_PREFIX}/articles/100500`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid data`, () => {

    const invalidArticle = {
      "userId": 1,
      "title": `Это`,
      "announce": `не`,
      "fullText": `валидный`,
      "createdDate": `объект, нет поля category`,
    };

    return request(server)
      .put(`${API_PREFIX}/articles/100500`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });

});

describe(`API correctly deletes an article`, () => {
  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .delete(`${API_PREFIX}/articles/1`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article count is 4 now`, () => request(server)
    .get(`${API_PREFIX}/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

  test(`API refuses to delete non-existent article`, () => {
    return request(server)
      .delete(`${API_PREFIX}/articles/1005`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns a list of comments to given article`, () => {
  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .get(`${API_PREFIX}/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(mockArticles[0].comments.length));

  test(`First comment's title is "\"Совсем немного...\", \"Согласен с автором!\","`, () => expect(response.body[0].text).toBe(`\"Совсем немного...\", \"Согласен с автором!\",`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    userId: 1,
    text: `Валидному комментарию достаточно этого поля`
  };

  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .post(`${API_PREFIX}/articles/1/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(server)
    .get(`${API_PREFIX}/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(mockArticles[0].comments.length + 1))
  );

});

describe(`API doesn't create a comment if data is invalid`, () => {
  let server;

  beforeAll(async () => {
    server = await createAPI();
  });

  test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
    return request(server)
      .post(`${API_PREFIX}/articles/1/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);

  });

  test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
    return request(server)
      .post(`${API_PREFIX}/articles/100500/comments`)
      .send({
        text: `Неважно насколько длинный этот комментарий`
      })
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API correctly deletes a comment`, () => {

  let server;
  let response;

  beforeAll(async () => {
    server = await createAPI();
    response = await request(server)
      .delete(`${API_PREFIX}/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 3 now`, () => request(server)
    .get(`${API_PREFIX}/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(mockArticles[0].comments.length - 1))
  );

});

describe(`API doesn't create a comment if data is invalid`, () => {
  let server;

  beforeAll(async () => {
    server = await createAPI();
  });

  test(`API refuses to delete non-existent comment`, () => {

    return request(server)
      .delete(`${API_PREFIX}/articles/1/comments/100500`)
      .expect(HttpCode.NOT_FOUND);
  });


  test(`API refuses to delete a comment to non-existent article`, () => {

    return request(server)
      .delete(`${API_PREFIX}/articles/100500/comments/1`)
      .expect(HttpCode.NOT_FOUND);

  });

});

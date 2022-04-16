"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const mockData = require(`./mocks/articles.mock.json`);

const createAPI = () => {
  const cloneData = JSON.parse(JSON.stringify(mockData));
  return getServer(cloneData);
};

describe(`API returns a list of all articles`, () => {
  let response;
  const server = createAPI();

  beforeAll(async () => {
    response = await request(server)
      .get(`${API_PREFIX}/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of articles which length equals mockData length`, () => expect(response.body.length).toBe(mockData.length));

  test(`First article's id equals "qyq7Pk"`, () => expect(response.body[0].id).toBe(`qyq7Pk`));
});

describe(`API returns an article with given id`, () => {
  const server = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(server)
      .get(`${API_PREFIX}/articles/qyq7Pk`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Обзор новейшего смартфона"`, () => expect(response.body.title).toBe(`Обзор новейшего смартфона`));
});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    "title": `Обзор новейшего смартфона созданный`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "createdDate": `2022-03-15T08:05:45.885Z`,
    "category": [
      `Деревья`,
      `За жизнь`
    ],
  };

  const server = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(server)
      .post(`${API_PREFIX}/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => {
    return expect(response.body).toEqual(expect.objectContaining(newArticle));
  });

  test(`Articles count has been changed`, () => request(server)
    .get(`${API_PREFIX}/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    "title": `Обзор новейшего смартфона`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "createdDate": `2022-03-15T08:05:45.885Z`,
    "category": [
      `Деревья`,
      `За жизнь`
    ],
  };

  test(`Without any required property response code is 400`, async () => {
    const server = createAPI();

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(server)
        .post(`${API_PREFIX}/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "title": `Обзор новейшего смартфона изменен`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "createdDate": `2022-03-15T08:05:45.885Z`,
    "category": [
      `Деревья`,
      `За жизнь`
    ],
  };

  const server = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(server)
      .put(`${API_PREFIX}/articles/qyq7Pk`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(server)
    .get(`${API_PREFIX}/articles/qyq7Pk`)
    .expect((res) => expect(res.body.title).toBe(`Обзор новейшего смартфона изменен`))
  );

});

describe(`API works correctly when trying to change an article in a wrong way`, () => {
  const server = createAPI();

  test(`API returns status code 404 when trying to change non-existent article`, () => {

    const validArticle = {
      "title": `Обзор новейшего смартфона`,
      "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
      "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
      "createdDate": `2022-03-15T08:05:45.885Z`,
      "category": [
        `Деревья`,
        `За жизнь`
      ],
    };

    return request(server)
      .put(`${API_PREFIX}/articles/NOEXST`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid data`, () => {

    const invalidArticle = {
      "title": `Это`,
      "announce": `не`,
      "fullText": `валидный`,
      "createdDate": `объект, нет поля category`,
    };

    return request(server)
      .put(`${API_PREFIX}/articles/NOEXST`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });

});

describe(`API correctly deletes an article`, () => {
  const server = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(server)
      .delete(`${API_PREFIX}/articles/qyq7Pk`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`qyq7Pk`));

  test(`Article count is 4 now`, () => request(server)
    .get(`${API_PREFIX}/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

  test(`API refuses to delete non-existent article`, () => {
    return request(server)
      .delete(`${API_PREFIX}/articles/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns a list of comments to given article`, () => {
  const server = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(server)
      .get(`${API_PREFIX}/articles/qyq7Pk/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));

  test(`First comment's id is "G1BWBr"`, () => expect(response.body[0].id).toBe(`G1BWBr`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const server = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(server)
      .post(`${API_PREFIX}/articles/qyq7Pk/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(server)
    .get(`${API_PREFIX}/articles/qyq7Pk/comments`)
    .expect((res) => expect(res.body.length).toBe(5))
  );

});

describe(`API doesn't create a comment if data is invalid`, () => {
  const server = createAPI();

  test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
    return request(server)
      .post(`${API_PREFIX}/articles/qyq7Pk/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);

  });

  test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
    return request(server)
      .post(`${API_PREFIX}/articles/NOEXST/comments`)
      .send({
        text: `Неважно`
      })
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API correctly deletes a comment`, () => {

  const server = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(server)
      .delete(`${API_PREFIX}/articles/qyq7Pk/comments/G1BWBr`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`G1BWBr`));

  test(`Comments count is 3 now`, () => request(server)
    .get(`${API_PREFIX}/articles/qyq7Pk/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

describe(`API doesn't create a comment if data is invalid`, () => {
  const server = createAPI();

  test(`API refuses to delete non-existent comment`, () => {

    return request(server)
      .delete(`${API_PREFIX}/articles/qyq7Pk/comments/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });


  test(`API refuses to delete a comment to non-existent article`, () => {

    return request(server)
      .delete(`${API_PREFIX}/articles/NOEXST/comments/kqME9j`)
      .expect(HttpCode.NOT_FOUND);

  });

});

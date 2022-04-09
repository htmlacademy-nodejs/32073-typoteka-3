"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);

const mockData = [
  {
    "id": `qyq7Pk`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Программировать не настолько сложно как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Как начать действовать? Для начала просто соберитесь.`,
    "createdDate": `2022-02-19T13:36:40.850Z`,
    "category": [
      `IT`,
      `Деревья`
    ],
    "comments": [
      {
        "id": `G1BWBr`,
        "text": `"Совсем немного...", "Согласен с автором!",`
      },
      {
        "id": `JY5_C1`,
        "text": ` "Планируете записать видосик на эту тему?" "Плюсую, но слишком много буквы!",`
      },
      {
        "id": `nkh_sd`,
        "text": `"Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.", "Совсем немного...",`
      },
      {
        "id": `xEDlR1`,
        "text": `"Планируете записать видосик на эту тему?" "Это где ж такие красоты?",`
      }
    ]
  },
  {
    "id": `CPgADB`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Он написал больше 30 хитов.`,
    "createdDate": `2022-03-15T08:05:45.885Z`,
    "category": [
      `Деревья`,
      `За жизнь`
    ],
    "comments": [
      {
        "id": `aPFt2j`,
        "text": `"Мне кажется или я уже читал это где-то?", "Совсем немного...", "Планируете записать видосик на эту тему?"`
      }
    ]
  },
  {
    "id": `OQhzXR`,
    "title": `Как начать программировать`,
    "announce": `Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Собрать камни бесконечности легко если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно как об этом говорят. Это один из лучших рок-музыкантов. Помните небольшое количество ежедневных упражнений лучше чем один раз но много.`,
    "createdDate": `2022-02-23T15:18:10.335Z`,
    "category": [
      `Разное`,
      `Без рамки`
    ],
    "comments": [
      {
        "id": `DN6Fv2`,
        "text": ` "Мне кажется или я уже читал это где-то?",`
      },
      {
        "id": `vfE3Or`,
        "text": `"Мне кажется или я уже читал это где-то?", "Плюсую, но слишком много буквы!",`
      },
      {
        "id": `7D4L_s`,
        "text": `"Это где ж такие красоты?",`
      }
    ]
  },
  {
    "id": `c9K5wz`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов.`,
    "createdDate": `2022-03-30T01:36:55.349Z`,
    "category": [
      `Деревья`,
      `Музыка`
    ],
    "comments": [
      {
        "id": `kUjZ07`,
        "text": `"Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.", "Согласен с автором!", "Совсем немного...",`
      },
      {
        "id": `B6uVgw`,
        "text": `"Плюсую, но слишком много буквы!", "Совсем немного...",`
      }
    ]
  },
  {
    "id": `atotdJ`,
    "title": `Как собрать камни бесконечности`,
    "announce": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов. Программировать не настолько сложно как об этом говорят. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "createdDate": `2022-03-11T20:47:08.051Z`,
    "category": [
      `Музыка`,
      `Кино`
    ],
    "comments": [
      {
        "id": `MRBjYx`,
        "text": `"Совсем немного...", `
      }
    ]
  }
];

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

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const server = createAPI();

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

  const server = createAPI();

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
});

test(`API refuses to delete non-existent article`, () => {
  const server = createAPI();

  return request(server)
    .delete(`${API_PREFIX}/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
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

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const server = createAPI();

  return request(server)
    .post(`${API_PREFIX}/articles/qyq7Pk/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const server = createAPI();

  return request(server)
    .post(`${API_PREFIX}/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
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

test(`API refuses to delete non-existent comment`, () => {
  const server = createAPI();

  return request(server)
    .delete(`${API_PREFIX}/articles/qyq7Pk/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {

  const server = createAPI();

  return request(server)
    .delete(`${API_PREFIX}/articles/NOEXST/comments/kqME9j`)
    .expect(HttpCode.NOT_FOUND);

});

'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const userValidator = require(`../middlewares/user-validator`);

const passwordUtils = require(`../lib/password`);

const route = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.get(`/count`, async (req, res) => {
    const count = await service.getCount();
    res.status(HttpCode.OK).json(count);
  });

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const usersNumber = await service.getCount();

    if (usersNumber === 1) {
      data.role = `admin`;
    } else {
      data.role = `user`;
    }

    const result = await service.create(data);

    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);
    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }
    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);
    if (passwordIsCorrect) {
      delete user.passwordHash;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  });
};

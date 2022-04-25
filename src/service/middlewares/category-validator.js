'use strict';
const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  NAME_EMPTY: `Имя категории отсутствует`,
  NAME_MIN: `Имя категории содержит меньше 5 символов`,
  NAME_MAX: `Имя категории не может содержать более 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.empty': ErrorArticleMessage.NAME_EMPTY,
    'string.min': ErrorArticleMessage.NAME_MIN,
    'string.max': ErrorArticleMessage.NAME_MAX
  }),
});

module.exports = (req, res, next) => {
  const newCategory = req.body;
  const {error} = schema.validate(newCategory, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

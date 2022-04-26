'use strict';

module.exports = (req, res, next) => {
  const {user} = req.session;
  if (!user || user.role !== `admin`) {
    return res.redirect(`/login`);
  }
  return next();
};

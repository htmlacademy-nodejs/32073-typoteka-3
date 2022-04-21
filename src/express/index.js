"use strict";

const express = require(`express`);
const session = require(`express-session`);
const getSequelize = require(`../service/lib/sequelize`);
const expressPinoLogger = require(`express-pino-logger`);
const sequelize = getSequelize();
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const path = require(`path`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {getLogger} = require(`../service/lib/logger`);
const logger = getLogger();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();
app.use(expressPinoLogger({logger}));

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(400).render(`404`));
app.use((err, req, res, next) => {
  logger.error(`An error occured on rendering the page: /n ${err}`);
  res.status(500).render(`500`);
  next();
});

app.listen(DEFAULT_PORT);

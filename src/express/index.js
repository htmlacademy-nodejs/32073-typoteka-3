"use strict";

const express = require(`express`);
const path = require(`path`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => res.status(400).send(`errors/404`));
app.use((err, req, res, next) => {
  res.status(500).send(`errors/500`);
  next();
});

app.listen(DEFAULT_PORT);

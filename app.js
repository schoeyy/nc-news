const express = require("express");
const { getNewsTopics, getApi } = require('./controllers/nc-news.controller');

const app = express();

app.get("/api", getApi);
app.get("/api/topics", getNewsTopics);

app.use((req, res, next) => {
  if (err.code && err.msg) {
    res.status(err.code).send({ msg: err.msg });
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
      res.status(500).send({ msg: "Internal Server Error!" });
  });

module.exports = app;

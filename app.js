const express = require("express");
const {
  getNewsTopics,
  getApi,
  getArticles,
  getArticleById,
  getArticleComments,
} = require("./controllers/nc-news.controller");

const app = express();

app.get("/api", getApi);
app.get("/api/topics", getNewsTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  if (err.code == "22P02") {
    res
      .status(400)
      .send({ msg: `Bad Request: This is not a valid article number!` });
  } else if (err.code && err.msg) {
    res.status(err.code).send({ msg: err.msg});
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;

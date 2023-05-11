const apiEndpoints = require("../endpoints.json");
const {
  fetchNewsTopics,
  fetchArticles,
  fetchArticleById,
} = require("../models/nc-news.model");

exports.getNewsTopics = (req, res, next) => {
  fetchNewsTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
  .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res) => {
  res.status(200).send({ apiEndpoints });
};
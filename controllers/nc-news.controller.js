const {
  fetchNewsTopics,
  fetchArticleById,
  fetchArticleCommentsById,
} = require("../models/nc-news.model");
const apiEndpoints = require("../endpoints.json");
const comments = require("../db/data/test-data/comments");

exports.getNewsTopics = (req, res, next) => {
  fetchNewsTopics()
    .then((topics) => {
      res.status(200).send({ topics });
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

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleCommentsById(article_id)
    .then((comments) => {
      res.status(200).then({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res) => {
  res.status(200).send({ apiEndpoints });
};

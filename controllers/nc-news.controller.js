const apiEndpoints = require("../endpoints.json");
const { fetchNewsTopics } = require("../models/nc-news.model");

exports.getNewsTopics = (req, res, next) => {
  fetchNewsTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res) => {
  res.status(200).send({ apiEndpoints });
};

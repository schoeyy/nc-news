const db = require("../db/connection");

exports.fetchNewsTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      code: 400,
      msg: `Bad Request: '${article_id}' is not a valid article number!`,
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount == 0) {
        return Promise.reject({
          code: 404,
          msg: `Not Found: Article ${article_id} cannot be found!`,
        });
      } else {
        return result.rows[0];
      }
    });
};

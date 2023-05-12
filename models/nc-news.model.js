const db = require("../db/connection");
const format = require("pg-format");

exports.fetchNewsTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
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

exports.fetchArticles = () => {
  return db
    .query(
      `
      SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT(comment_id) AS comment_count
      FROM articles
      JOIN comments 
      ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;
  const query = format(
    `
        INSERT INTO comments
        (body, article_id, username)
        VALUES %L
        RETURNING *;
    `,
    [body, article_id, username]
  );
  return db.query(query).then((result) => result.rows[0]);
};

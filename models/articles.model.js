const db = require("../db/connection");
const format = require("pg-format");
const selectTopicBySlug = require("../models/topics.model");

exports.fetchArticles = async ({
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1,
}) => {
  let selectQuery = format(
    `
      SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count, (SELECT CAST(COUNT(*) AS INT) FROM articles ${
        topic ? "WHERE topic = '%s'" : ""
      }) AS total_count
      FROM articles
      LEFT OUTER JOIN comments ON comments.article_id = articles.article_id
      `,
    [topic]
  );

  if (topic) {
    const topicObject = await selectTopicBySlug(topic);
    if (topicObject) {
      selectQuery += format(`WHERE articles.topic = '%s'`, topic);
    } else {
      return Promise.reject({
        code: 404,
        msg: "404 Topic not found!",
      });
    }
  }

  selectQuery += format(
    `
    GROUP BY articles.article_id
    ORDER BY articles.%I %s
    LIMIT %s OFFSET %s`,
    sort_by,
    order,
    limit,
    (Number(p) - 1) * limit
  );

  return db.query(selectQuery).then(({ rows }) => {
    return {
      total_count: rows[0]?.total_count ?? 0,
      articles: rows.map((row) => {
        delete row.total_count;
        return row;
      }),
    };
  });
};

exports.fetchArticleById = (article_id) => {
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db
        .query(
          `
          SELECT articles.*, CAST(COUNT(comment_id) AS INT) AS comment_count
          FROM articles
          LEFT JOIN comments ON comments.article_id = articles.article_id
          WHERE articles.article_id = $1
          GROUP BY articles.article_id`,
          [article_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    }
  });
};

exports.fetchArticleComments = (article_id) => {
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db
        .query(
          `
          SELECT * FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;
        `,
          [article_id]
        )
        .then((result) => {
          return result.rows;
        });
    }
  });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;
  const query = format(
    `
          INSERT INTO comments
          (body, article_id, author)
          VALUES 
          %L
          RETURNING *;
      `,
    [[body, article_id, username]]
  );
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db.query(query).then((result) => result.rows[0]);
    }
  });
};

exports.updateArticle = (article_id, newData) => {
  const { votes } = newData;
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db
        .query(
          `
        UPDATE articles
        SET
          votes = votes + $1
        WHERE
          article_id = $2
        RETURNING *;
        `,
          [votes, article_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    }
  });
};

exports.removeArticle = (article_id) => {
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db
        .query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
        .then(() => {
          return db.query("DELETE FROM articles WHERE article_id = $1", [
            article_id,
          ]);
        });
    }
  });
};

exports.addArticle = ({
  author,
  title,
  body,
  topic,
  article_img_url = "[default img]",
}) => {
  const query = format(
    `INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES
    %L
    RETURNING *;
    `,
    [[author, title, body, topic, article_img_url]]
  );
  return db.query(query).then((result) => {
    const article = result.rows[0];
    return this.fetchArticleById(article.article_id);
  });
};

exports.removeArticleById = (article_id) => {
  return articleExists(article_id).then((article) => {
    if (!article) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Article ${article_id} cannot be found!`,
      });
    } else {
      return db
        .query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
        .then(() => {
          return db.query("DELETE FROM articles WHERE article_id = $1", [
            article_id,
          ]);
        });
    }
  });
};

function articleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => result.rows[0]);
}

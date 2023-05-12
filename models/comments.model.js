const db = require("../db/connection.js");

exports.deleteComment = (comment_id) => {
  return commentExists(comment_id).then((comment) => {
    if (!comment) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Comment #${comment_id} cannot be found!`,
      });
    } else {
      return db.query(
        `
        DELETE FROM comments
        WHERE comment_id = $1
    `,
        [comment_id]
      );
    }
  });
};

exports.updateComment = (comment_id, { votes }) => {
  return commentExists(comment_id).then((comment) => {
    if (!comment) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: Comment #${comment_id} cannot be found!`,
      });
    } else {
      return db
        .query(
          `
            UPDATE comments
            SET
            votes = votes + $1
            WHERE
            comment_id = $2
            RETURNING *
  `,
          [votes, comment_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    }
  });
};

function commentExists(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => result.rows[0]);
}

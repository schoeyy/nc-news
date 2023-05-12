const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

exports.fetchUserByUsername = (username) => {
  return userExists(username).then((user) => {
    if (!user) {
      return Promise.reject({
        code: 404,
        msg: `Not Found: User ${username} cannot be found!`,
      });
    } else {
      return db
        .query("SELECT * FROM users WHERE username = $1", [username])
        .then((result) => {
          return result.rows[0];
        });
    }
  });
};

function userExists(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => result.rows[0]);
}

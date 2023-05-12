const {
  removeComment,
  patchComment,
} = require("../controllers/comments.controller");

const commentRouter = require("express").Router();

commentRouter.patch("/:comment_id", patchComment);
commentRouter.delete("/:comment_id", removeComment);

module.exports = commentRouter;

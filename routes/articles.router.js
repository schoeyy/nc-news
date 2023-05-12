const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticle,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/")
  .get(getArticles)
  .post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articleRouter;

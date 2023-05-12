const { getApiData } = require("../controllers/api.controller");
const articleRouter = require("./articles.router");
const commentRouter = require("./comment.router");
const topicRouter = require("./topics.router");
const userRouter = require("./user.router");

const apiRouter = require("express").Router();

apiRouter.get("/", getApiData);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;

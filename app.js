const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const { customErr, dbErr, errLog } = require("./error-handler");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", apiRouter);

app.use(dbErr);
app.use(customErr);
app.use(errLog);

module.exports = app;

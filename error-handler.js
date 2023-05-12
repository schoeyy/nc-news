exports.customErr = (err, req, res, next) => {
  if (err.code && err.msg) {
    res.status(err.code).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.dbErr = (err, req, res, next) => {
  const errorCodes = ["22P02", "23502"];
  if (errorCodes.includes(err.code)) {
    res
      .status(400)
      .send({ msg: `Bad Request: This is not a valid input!` });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "404 Not found!" });
  } else {
    next(err);
  }
};


exports.errLog = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error!" });
};

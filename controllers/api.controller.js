const apiEndpoints = require("../endpoints.json");

exports.getApiData = (req, res) => {
  res.status(200).send({ apiEndpoints });
};

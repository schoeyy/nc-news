const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const apiResponse = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => connection.end());

describe("Api", () => {
  describe("GET /api", () => {
    test("Status: 200 || responds with all available api endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const { apiEndpoints } = response.body;
          expect(apiEndpoints).toEqual(apiResponse);
        });
    });
  });
});
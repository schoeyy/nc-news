const app = require("./../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const apiResponse = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics || Status: 200", () => {
  test(`Endpoint should return an array of objects, these objects should contain properties 'slug', and 'description'`, () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api || Status: 200", () => {
  test("GET - status: 200 - responds with all available api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { apiEndpoints } = response.body;
        expect(apiEndpoints).toEqual(apiResponse);
      });
  });
});

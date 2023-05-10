const app = require("./../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

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

describe("GET /api/articles/:article_id || Status: 200", () => {
  test(`should respond with the correct article, with the required properties`, () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test(`should return a not found error when the article doesn't exist`, () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toEqual("Not Found: Article 10000 cannot be found!");
      });
  });
  test(`should return a error when passed an invalid article id`, () => {
    return request(app)
      .get("/api/articles/somenews")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toEqual("Bad Request: 'somenews' is not a valid article number!");
      });
  });
});

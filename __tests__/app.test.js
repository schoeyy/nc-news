const app = require("./../app");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const apiResponse = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("Api", () => {
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
});

describe("Topics", () => {
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
});

describe("Articles", () => {
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
          expect(msg).toBe("Bad Request: This is not a valid article number!");
        });
    });
  });

  describe("GET /api/articles || Status: 200", () => {
    test("responds with an array of article objects containing data about the article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length > 0).toBe(true);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    test("results should be ordered by creation date, in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});

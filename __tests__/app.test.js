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

describe("Topics", () => {
  describe("GET /api/topics || Status: 200", () => {
    test(`Status: 200 || Endpoint should return an array of objects, these objects should contain properties 'slug', and 'description'`, () => {
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
  describe("GET /api/articles/:article_id", () => {
    test(`Status: 200 || should respond with the correct article, with the required properties`, () => {
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
    test(`Status: 404 || should return a not found error when the article doesn't exist`, () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toEqual("Not Found: Article 10000 cannot be found!");
        });
    });
    test(`Status: 400 || should return a error when passed an invalid article id`, () => {
      return request(app)
        .get("/api/articles/somenews")
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Bad Request: This is not a valid article number!");
        });
    });
  });
  test(`Status: 404 || should return a not found error when the article doesn't exist`, () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toEqual("Not Found: Article 10000 cannot be found!");
      });
  });
  test(`Status: 400 || should return a error when passed an invalid article id`, () => {
    return request(app)
      .get("/api/articles/somenews")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid article number!");
      });
  });
  describe("GET /api/articles", () => {
    test("Status: 200 || responds with an array of article objects containing data about the article", () => {
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
    test("Status: 200 || results should be ordered by creation date, in descending order", () => {
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
  describe("GET /api/articles/:article_id/comments", () => {
    test("Status: 200 || responds with all the comments for given article, in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments.length === 11).toBe(true);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
    test("Status: 200 || makes sure the response has results sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Status: 400 || invalid article id should give an error", () => {
      return request(app)
        .get("/api/articles/invalidId/comments")
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Bad Request: This is not a valid article number!");
        });
    });
    test("Status: 404 || article_id not found", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toEqual("Not Found: Article 10000 cannot be found!");
        });
    });
  });
});

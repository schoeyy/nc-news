const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => connection.end());

describe("GET /api/articles", () => {
  test("Status: 200 || responds with an array of article objects containing data about the article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles, total_count } = response.body;
        expect(articles.length > 0).toBe(true);
        expect(total_count).toBe(12);
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
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
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});

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
        expect(msg).toBe("Bad Request: This is not a valid input!");
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
        expect(msg).toBe("Bad Request: This is not a valid input!");
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
describe("POST /api/articles/:article_id/comments", () => {
  test("Status: 201 || should take a comment, add it to the article and respond with the commend added", () => {
    const newComment = {
      username: "theodore_bagwell",
      body: "When I play cards it ain't gamblin'",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          body: expect.any(String),
          author: expect.any(String),
        });
      });
  });
  test("Status: 201 || when additional data is passed in, any unecessary data is ignored and the comment is added", () => {
    const newComment = {
      username: "theodore_bagwell",
      body: "When I play cards it ain't gamblin'",
      votes: 4,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          body: expect.any(String),
          author: expect.any(String),
          votes: 0,
        });
      });
  });
  test("Status: 400 || Give an error if required information is missing from the post request", () => {
    const newComment = {
      username: "theodore_bagwell",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
  test("Status: 404 || should give an error if the username doesn't exist", () => {
    const newComment = {
      username: "michael_scott",
      body: "Today, smoking is going to save lives.",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("404 Not found!");
      });
  });
  test("Status: 400 || invalid article id should give an error", () => {
    return request(app)
      .get("/api/articles/invalidId/comments")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("Status: 200 || responds with updated article", () => {
    const update = {
      votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("Status: 200 || is able to decrement vote count", () => {
    const update = {
      votes: -2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(98);
      });
  });
  test("Status: 404 || responds with an error when the article id cannot be found", () => {
    const update = {
      votes: 1,
    };
    return request(app)
      .patch("/api/articles/10000")
      .send(update)
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found: Article 10000 cannot be found!");
      });
  });
  test("Status: 400 || responds with an error when article ID is invalid", () => {
    const update = {
      votes: 1,
    };
    return request(app)
      .patch("/api/articles/simba")
      .send(update)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
  test("Status: 400 || repsonds with an error when 'votes' input is invalid", () => {
    const update = {
      votes: "simba",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});

describe("POST /api/articles", () => {
  test("Status: 201 - returns the created article to the user", () => {
    const newArticle = {
      author: "rogersop",
      title: "bestest mensch",
      body: "dwight picked jim to be his bestest mensch",
      topic: "paper",
      article_img_url:
        "https://thoughtcatalog.com/wp-content/uploads/2015/10/giphy2.gif",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("Status: 200 - should return a default image if there isn't one provided", () => {
    const newArticle = {
      author: "rogersop",
      title: "bestest mensch",
      body: "dwight picked jim to be his bestest mensch",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const { article } = response.body;
        expect(article.article_img_url).toBe("[default img]");
      });
  });
  test("Status: 404 - returns an error if the author is not found", () => {
    const newArticle = {
      author: "michaelscott",
      title: "plasma screen tv",
      body: "I just got a new plasma tv",
      topic: "paper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("404 Not found!");
      });
  });
  test("Status: 404 - returns an error if the topic cannot be found", () => {
    const newArticle = {
      author: "rogersop",
      title: "plasma screen tv",
      body: "I just got a new plasma tv",
      topic: "televisions",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("404 Not found!");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("Status: 204 - should delete the given article with no response", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("Status: 404 - if article id doesnt exist", () => {
    return request(app)
      .delete("/api/articles/10000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found: Article 10000 cannot be found!");
      });
  });
  test("Status: 400 - return an error if the input ID is invalid", () => {
    return request(app)
      .delete("/api/articles/simba")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});

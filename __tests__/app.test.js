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
  test("This endpoint should response with an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          topics: [
            {
              description: "The man, the Mitch, the legend",
              slug: "mitch",
            },
            {
              description: "Not dogs",
              slug: "cats",
            },
            {
              description: "what books are made of",
              slug: "paper",
            },
          ],
        });
      });
  });
  test(`These objects should contain properties 'slug', and 'description'`, () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        topics.forEach((topic) => {
          expect(topic).hasOwnProperty("slug");
          expect(topic).hasOwnProperty("description");
        });
      });
  });
  describe("[ERROR] GET /api/topics || Status: 500", () => {
    test("User should see an error if there server cannot access data from a database", () => {
      return db
        .query(
          `
      DROP TABLE comments;
      DROP TABLE articles;
      DROP TABLE users;
      DROP TABLE topics;
      `
        )
        .then(() => {
          return request(app).get("/api/topics").expect(500);
        })
        .then((response) => {
          expect(response.body.msg).toBe("Internal Server Error!");
        });
    });
  });
});

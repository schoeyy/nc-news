const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test(`Status: 200 || should return a topics slug & description`, () => {
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
describe("POST /api/topic", () => {
  test("Status: 201 || responds with the newly created topic", () => {
    const newTopic = {
      slug: "laptop",
      description: "a topic about laptops",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((response) => {
        const { topic } = response.body;
        expect(topic.slug).toBe(newTopic.slug);
        expect(topic.description).toBe(newTopic.description);
      });
  });
  test("Status: 400 || returns an error to the user if input data is missing", () => {
    const newTopic = {
      description: "a great bevarage",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});
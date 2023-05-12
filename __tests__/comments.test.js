const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});
afterAll(() => connection.end());

describe("DELETE /api/comments/:comment_id", () => {
  test("Status: 204 || returns a 204 code, with no content on successful action", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("Status: 404 || comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found: Comment #10000 cannot be found!");
      });
  });
  test("Status: 400 || comment_id is invalid (e.g not Number)", () => {
    return request(app)
      .delete("/api/comments/simba")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("Status: 200 || if successful, comment is updated and returned to the user", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: 5 })
      .expect(200)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("Status: 200 || if successful, votes should be decreased and result returned to user", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ votes: -2 })
      .expect(200)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 98,
        });
      });
  });
  test("Status: 404 || returns an error to the user if comment cannot be found", () => {
    return request(app)
      .patch("/api/comments/10000")
      .send({ votes: 2 })
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found: Comment #10000 cannot be found!");
      });
  });
  test("Status: 400 || returns an error to the user if commend_id is invalid", () => {
    return request(app)
      .patch("/api/comments/simba")
      .send({ votes: 2 })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
  test("Status: 400 || if the data to update input is invalid, return an error to the user", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: "simba" })
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad Request: This is not a valid input!");
      });
  });
});

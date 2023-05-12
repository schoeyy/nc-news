const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/users", () => {
  test("Status: 200 || should return an array of users to the user", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        expect(users.length > 0).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("Status: 200 || returns the user details in an object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const { user } = response.body;
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url: expect.any(String),
        });
      });
  });
  test("Status: 404 || returns an error to the user if a username is not found", () => {
    return request(app)
      .get("/api/users/simba")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found: User simba cannot be found!");
      });
  });
});

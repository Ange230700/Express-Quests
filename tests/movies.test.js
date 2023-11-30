const request = require("supertest");

const app = require("../src/app");

const database = require("../database");

afterAll(async () => {
  await database.end();
})

describe("GET /api/movies", () => {
  it("should check if the response has a json format", async () => {
    const response = await request(app).get("/api/movies");
    expect(response.headers["content-type"]).toMatch(/json/);
  });
  it("should check if the response has a status code of 200", async () => {
    const response = await request(app).get("/api/movies");
    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should check if the response has a json format", async () => {
    const response = await request(app).get("/api/movies/1");
    expect(response.headers["content-type"]).toMatch(/json/);
  });
  it("should check if the response has a status code of 200", async () => {
    const response = await request(app).get("/api/movies/1");
    expect(response.status).toEqual(200);
  });
  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");
    expect(response.status).toEqual(404);
  });
});
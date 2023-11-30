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

describe("POST /api/movies", () => {
  it("should check if the response has a json format", async () => {
    const newMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: 1999,
      color: "1",
      duration: 136
    };
    const response = await request(app).post("/api/movies").send(newMovie);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 201", async () => {
    const newMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).post("/api/movies").send(newMovie);
    expect(response.status).toEqual(201);
  });

  it("should check the existence of all required fields", async () => {
    const newMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).post("/api/movies").send(newMovie);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("director");
    expect(response.body).toHaveProperty("year");
    expect(response.body).toHaveProperty("color");
    expect(response.body).toHaveProperty("duration");

    const [movie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [response.body.id]);
    const [movieFromDatabase] = movie;
    expect(movieFromDatabase).toHaveProperty("id");
    expect(movieFromDatabase).toHaveProperty("title");
    expect(movieFromDatabase).toHaveProperty("director");
    expect(movieFromDatabase).toHaveProperty("year");
    expect(movieFromDatabase).toHaveProperty("color");
    expect(movieFromDatabase).toHaveProperty("duration");
  });

  it("should check the type of all required fields", async () => {
    const newMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).post("/api/movies").send(newMovie);
    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.title).toBe("string");
    expect(typeof response.body.director).toBe("string");
    expect(typeof response.body.year).toBe("string");
    expect(typeof response.body.color).toBe("string");
    expect(typeof response.body.duration).toBe("number");

    const [movie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [response.body.id]);
    const [movieFromDatabase] = movie;
    expect(typeof movieFromDatabase.id).toBe("number");
    expect(typeof movieFromDatabase.title).toBe("string");
    expect(typeof movieFromDatabase.director).toBe("string");
    expect(typeof movieFromDatabase.year).toBe("string");
    expect(typeof movieFromDatabase.color).toBe("string");
    expect(typeof movieFromDatabase.duration).toBe("number");
  });

  it("should return an error if a required field is missing", async () => {
    const newMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: 1999,
      duration: 136
    };
    const response = await request(app).post("/api/movies").send(newMovie);
    expect(response.status).toEqual(400);
  });
});
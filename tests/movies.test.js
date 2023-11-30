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

describe("PUT /api/movie/:id", () => {
  it("should check if the response has a json format", async () => {
    const id = 1;
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).put(`/api/movies/${id}`).send(updateMovie);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 200", async () => {
    const id = 1;
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).put(`/api/movies/${id}`).send(updateMovie);
    expect(response.status).toEqual(200);
  });

  it("should check the existence of all required fields", async () => {
    const id = 1;
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).put(`/api/movies/${id}`).send(updateMovie);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("director");
    expect(response.body).toHaveProperty("year");
    expect(response.body).toHaveProperty("color");
    expect(response.body).toHaveProperty("duration");

    const [movie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [id]);
    const [movieFromDatabase] = movie;
    expect(movieFromDatabase).toHaveProperty("id");
    expect(movieFromDatabase).toHaveProperty("title");
    expect(movieFromDatabase).toHaveProperty("director");
    expect(movieFromDatabase).toHaveProperty("year");
    expect(movieFromDatabase).toHaveProperty("color");
    expect(movieFromDatabase).toHaveProperty("duration");
  });

  it("should check the type of all required fields", async () => {
    const id = 1;
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    await request(app).put(`/api/movies/${id}`).send(updateMovie);

    const [movie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [id]);
    const [movieFromDatabase] = movie;
    expect(typeof movieFromDatabase.id).toBe("number");
    expect(typeof movieFromDatabase.title).toBe("string");
    expect(typeof movieFromDatabase.director).toBe("string");
    expect(typeof movieFromDatabase.year).toBe("string");
    expect(typeof movieFromDatabase.color).toBe("string");
    expect(typeof movieFromDatabase.duration).toBe("number");
  });

  it("should return an error if a required field is missing", async () => {
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: 1999,
      duration: 136
    };
    const response = await request(app).put("/api/movies/1").send(updateMovie);
    expect(response.status).toEqual(400);
  });

  it("should check if the modifications have been saved", async () => {
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).put("/api/movies/1").send(updateMovie);
    expect(response.body.title).toStrictEqual(updateMovie.title);
    expect(response.body.director).toStrictEqual(updateMovie.director);
    expect(response.body.year).toStrictEqual(updateMovie.year);
    expect(response.body.color).toStrictEqual(updateMovie.color);
    expect(response.body.duration).toStrictEqual(updateMovie.duration);

    const [movie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [response.body.id]);
    const [movieFromDatabase] = movie;
    expect(movieFromDatabase.title).toStrictEqual(updateMovie.title);
    expect(movieFromDatabase.director).toStrictEqual(updateMovie.director);
    expect(movieFromDatabase.year).toStrictEqual(updateMovie.year);
    expect(movieFromDatabase.color).toStrictEqual(updateMovie.color);
    expect(movieFromDatabase.duration).toStrictEqual(updateMovie.duration);
  });

  it("should return no movie", async () => {
    const updateMovie = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const response = await request(app).put("/api/movies/0").send(updateMovie);
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /api/movies/:id", () => {
  it("should check if the response has a status code of 204", async () => {
    const movieToDelete = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const [movie] = await database.query("INSERT INTO `movies` (`title`, `director`, `year`, `color`, `duration`) VALUES (?, ?, ?, ?, ?)", [movieToDelete.title, movieToDelete.director, movieToDelete.year, movieToDelete.color, movieToDelete.duration]);
    const id = movie.insertId;
    const response = await request(app).delete(`/api/movies/${id}`);
    expect(response.status).toEqual(204);
  });

  it("should check if the movie has been deleted", async () => {
    const movieToDelete = {
      title: "The Matrix",
      director: "Lana Wachowski",
      year: "1999",
      color: "1",
      duration: 136
    };
    const [movie] = await database.query("INSERT INTO `movies` (`title`, `director`, `year`, `color`, `duration`) VALUES (?, ?, ?, ?, ?)", [movieToDelete.title, movieToDelete.director, movieToDelete.year, movieToDelete.color, movieToDelete.duration]);
    const id = movie.insertId;
    await request(app).delete(`/api/movies/${id}`);
    const [deletedMovie] = await database.query("SELECT * FROM `movies` WHERE `id` = ?", [id]);
    expect(deletedMovie.length).toBe(0);
  });

  it("should return no movie", async () => {
    const response = await request(app).delete("/api/movies/0");
    expect(response.status).toEqual(404);
  });
});
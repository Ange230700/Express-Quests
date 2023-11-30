const request = require("supertest");

const app = require("../src/app");

const database = require("../database");
const crypto = require("node:crypto");
const e = require("express");

afterAll(async () => {
  await database.end();
});

describe("GET /api/users", () => {
  it("should check if the response has a json format", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 200", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should check if the response has a json format", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 200", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");
    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should check if the response has a json format", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 201", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
  });

  it("should check the existence of all required fields", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("firstname");
    expect(response.body).toHaveProperty("lastname");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("city");
    expect(response.body).toHaveProperty("language");

    const [user] = await database.query("SELECT * FROM `users` WHERE `id` = ?", [response.body.id]);
    const [userFromDatabase] = user;
    expect(userFromDatabase).toHaveProperty("id");
    expect(userFromDatabase).toHaveProperty("firstname");
    expect(userFromDatabase).toHaveProperty("lastname");
    expect(userFromDatabase).toHaveProperty("email");
    expect(userFromDatabase).toHaveProperty("city");
    expect(userFromDatabase).toHaveProperty("language");
  });

  it("should check the type of all required fields", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(typeof response.body.id).toBe("number");
    expect(typeof response.body.firstname).toBe("string");
    expect(typeof response.body.lastname).toBe("string");
    expect(typeof response.body.email).toBe("string");
    expect(typeof response.body.city).toBe("string");
    expect(typeof response.body.language).toBe("string");

    const [user] = await database.query("SELECT * FROM `users` WHERE `id` = ?", [response.body.id]);
    const [userFromDatabase] = user;
    expect(typeof userFromDatabase.id).toBe("number");
    expect(typeof userFromDatabase.firstname).toBe("string");
    expect(typeof userFromDatabase.lastname).toBe("string");
    expect(typeof userFromDatabase.email).toBe("string");
    expect(typeof userFromDatabase.city).toBe("string");
    expect(typeof userFromDatabase.language).toBe("string");
  });

  it("should return a 400 status code", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: "sdcvdf@dd.dd",
      city: "Paris"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(400);
  });

  it("should return a 409 status code", async () => {
    const newUser = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        city: "Paris",
        language: "English"
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(409);
  });
});

describe("PUT /api/users/:id", () => {
  it("should check if the response has a json format", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).put("/api/users/1").send(newUser);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should check if the response has a status code of 200", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).put("/api/users/1").send(newUser);
    expect(response.status).toEqual(200);
  });

  it("should check the existence of all required fields", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).put("/api/users/1").send(newUser);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("firstname");
    expect(response.body).toHaveProperty("lastname");
    expect(response.body).toHaveProperty("email");

    const [user] = await database.query("SELECT * FROM `users` WHERE `id` = ?", [response.body.id]);
    const [userFromDatabase] = user;
    expect(userFromDatabase).toHaveProperty("id");
    expect(userFromDatabase).toHaveProperty("firstname");
    expect(userFromDatabase).toHaveProperty("lastname");
    expect(userFromDatabase).toHaveProperty("email");
  });

  it("should check the type of all required fields", async () => {
    const id = 1;
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    await request(app).put(`/api/users/${id}`).send(newUser);

    const [user] = await database.query("SELECT * FROM `users` WHERE `id` = ?", [id]);
    const [userFromDatabase] = user;
    expect(typeof userFromDatabase.id).toBe("number");
    expect(typeof userFromDatabase.firstname).toBe("string");
    expect(typeof userFromDatabase.lastname).toBe("string");
    expect(typeof userFromDatabase.email).toBe("string");
  });

  it("should return a 400 status code", async () => {
    const id = 1;
    const newUser = {
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "New York"
    };
    const response = await request(app).put(`/api/users/${id}`).send(newUser);
    expect(response.status).toEqual(400);
  });

  it("should return a 409 status code", async () => {
    const id = 6;
    const newUser = {
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      city: "London",
      language: "English"
    };
    const response = await request(app).put(`/api/users/${id}`).send(newUser);
    expect(response.status).toEqual(409);
  });

  it("should return a 404 status code", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris"
    };
    const response = await request(app).put("/api/users/0").send(newUser);
    expect(response.status).toEqual(404);
  });

  it("should check if the modifications have been saved", async () => {
    const id = 1;
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: `${crypto.randomUUID()}@example.com`,
      city: "Paris",
      language: "French"
    };
    const response = await request(app).put(`/api/users/${id}`).send(newUser);
    expect(response.body.firstname).toStrictEqual(newUser.firstname);
    expect(response.body.lastname).toStrictEqual(newUser.lastname);
    expect(response.body.email).toStrictEqual(newUser.email);

    const [user] = await database.query("SELECT * FROM `users` WHERE `id` = ?", [response.body.id]);
    const [userFromDatabase] = user;
    expect(userFromDatabase.firstname).toStrictEqual(newUser.firstname);
    expect(userFromDatabase.lastname).toStrictEqual(newUser.lastname);
    expect(userFromDatabase.email).toStrictEqual(newUser.email);
  });
});
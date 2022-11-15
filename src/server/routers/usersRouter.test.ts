import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcryptjs";
import type { Credentials, RegisterCredentials } from "../controllers/types";
import User from "../../database/models/User";
import connectDatabase from "../../database";
import app from "../app";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("Given a POST method with /users/register endpoint", () => {
  describe("When it receives a request with username 'mireia' and password '123456' and email 'mireia@gmail.com'", () => {
    test("Then it should respond with a 201 status and a user mireia and id", async () => {
      const expectedStatus = 201;
      const registerData: RegisterCredentials = {
        username: "mireia",
        password: "123456",
        email: "mireia@gmail.com",
        name: "mireia",
        job: "student",
      };

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(expectedStatus);

      const newUser = await User.findOne({ username: registerData.username });

      expect(response.body).toHaveProperty("username", registerData.username);
      expect(response.body).toHaveProperty("id", newUser.id);
    });
  });
});

describe("Given a POST method with /users/login endpoint", () => {
  const loginData: Credentials = {
    username: "mireia",
    password: "123456",
  };

  const hashedPassword = bcrypt.hash(loginData.password, 10);

  describe("When it receives a request with username 'mireia' and password '123456'", () => {
    test("Then it should respond with a 200 status and the user token", async () => {
      const newUser: RegisterCredentials = {
        username: "mireia",
        password: await hashedPassword,
        email: "mireia@gmail.com",
        name: "mireia",
        job: "student",
      };
      const expectedStatus = 200;

      await User.create(newUser);

      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with When it receives a request with username 'mireia' and password '123456' and it doesn't exist in the database", () => {
    test("Then it should respond with a 401 and message 'Wrong credentials'", async () => {
      const expectedStatus = 401;
      const expectedMessage = "Wrong credentials";

      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

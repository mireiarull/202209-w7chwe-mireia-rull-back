import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import type { Credentials } from "../controllers/types";
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
      const registerData: Credentials = {
        username: "mireia",
        password: "123456",
        email: "mireia@gmail.com",
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

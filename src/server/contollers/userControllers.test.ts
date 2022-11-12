import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { registerUser } from "./userControllers";
import User from "../../database/models/User";
import CustomError from "../../CustomError/CustomError";
import mongoose from "mongoose";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const user = {
    username: "mireia",
    password: "1234",
    email: "mireia@gmail.com",
  };

  const req: Partial<Request> = {
    body: user,
  };

  describe("When it receives a username 'mireia' and a password '1234' and email 'mireia@gmail.com'", () => {
    test("Then it should invoke its method status with 201 and its method json with the user id and the username", async () => {
      const expectedStatus = 201;

      User.create = jest.fn().mockResolvedValueOnce(user);
      const userId = new mongoose.Types.ObjectId();
      bcrypt.hash = jest.fn().mockResolvedValueOnce(user.password);
      User.create = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        id: userId,
        username: user.username,
        email: user.email,
      });
    });
  });

  describe("When it receives a username 'mireia' that already exists", () => {
    test("Then it should next with status 409 and a public message 'User already registered'", async () => {
      const error = new CustomError(
        "duplicate key",
        409,
        "User already registered"
      );

      User.create = jest.fn().mockRejectedValueOnce(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

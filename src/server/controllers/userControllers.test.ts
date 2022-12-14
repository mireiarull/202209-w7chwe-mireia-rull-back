import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { getAllUsers, loginUser, registerUser } from "./userControllers";
import jwt from "jsonwebtoken";
import User from "../../database/models/User";
import CustomError from "../../CustomError/CustomError";
import mongoose from "mongoose";
import type { Credentials } from "./types";
import type { CustomRequest } from "../../types";
import Relationship from "../../database/models/Relationship";

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
    job: "student",
    name: "mireia",
    token: "",
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

      const userToken = jwt.sign({}, "secret");
      jwt.sign = jest.fn().mockReturnValueOnce(userToken);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        id: userId,
        username: user.username,
        email: user.email,
        job: user.job,
        name: user.name,
        token: userToken,
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

describe("Given a loginUser controller", () => {
  const loginBody: Credentials = {
    username: "admin",
    password: "admin123",
  };

  const req: Partial<Request> = {
    body: loginBody,
  };

  describe("When it receives a request with an invalid username", () => {
    test("Then it should invoke the next function with a username error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const usernameError = new CustomError(
        "Username not found",
        401,
        "Wrong credentials"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(usernameError);
    });
  });

  describe("When it receives a valid username 'admin' and the wrong password", () => {
    test("Then it should invoke the next function with a password error", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(loginBody);
      const passwordError = new CustomError(
        "Password is incorrect",
        401,
        "Wrong credentials"
      );

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toBeCalledWith(passwordError);
    });
  });

  describe("when it receives a valid username 'admin' and a valid password 'admin123'", () => {
    test("Then it should invoke the response method with a 200 status and its json method with a token", async () => {
      const user = {
        username: "admin",
        password: "admin",
      };
      const userId = new mongoose.Types.ObjectId();
      const expectedStatus = 200;
      req.body = user;

      const token = jwt.sign({}, "secret");

      User.findOne = jest.fn().mockResolvedValueOnce({ ...user, _id: userId });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValueOnce(token);

      await loginUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });
});

describe("Given a loadAllUsers controller", () => {
  describe("When it receives a request with the current user's id", () => {
    test("Then it should return a list of all the users and a list with all the relationships matching the user, and a status of 200", async () => {
      const expectedStatus = 200;
      const users = [
        {
          username: "admin",
          password: "",
          email: "admin@admin.com",
          id: "",
        },
        {
          username: "mireia",
          password: "",
          email: "mireia",
          id: "54321",
        },
      ];

      const usersRelations = [
        {
          user1: "12345",
          user2: "54321",
          relation: "friends",
        },
      ];
      const req: Partial<CustomRequest> = {
        userId: "12345",
      };
      User.find = jest.fn().mockResolvedValueOnce(users);
      Relationship.find = jest.fn().mockResolvedValueOnce(usersRelations);

      await getAllUsers(req as CustomRequest, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ users, usersRelations });
    });
  });
});

import type { Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError, notFoundError } from "./error";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe("Given a generalError middleware", () => {
  describe("When it receives a response with status code 400 ans a public message", () => {
    test("Then it should call its method status with the status code 400", () => {
      const statusCode = 400;
      const error = new CustomError("", 400, "");
      generalError(error, null, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call its method json with 'General error'", () => {
      const publicMessage = "General error";
      const error = new CustomError("", 400, publicMessage);
      const expectedPublicMessage = { error: publicMessage };

      generalError(error, null, res as Response, () => {});

      expect(res.json).toHaveBeenCalledWith(expectedPublicMessage);
    });
  });

  describe("When it's invoked with an empty status code", () => {
    test("Then it should call its default 500 method status", () => {
      const expectedStatusCode = 500;
      const error = new CustomError("", null, "");
      generalError(error, null, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it's invoked with an empty message", () => {
    test("Then it should call its method json with the deafult message 'Something went wrong'", () => {
      const publicMessage = "Something went wrong";
      const error = new CustomError("", 500, null);
      const expectedPublicMessage = { error: publicMessage };

      generalError(error, null, res as Response, () => {});

      expect(res.json).toHaveBeenCalledWith(expectedPublicMessage);
    });
  });
});

describe("Given a notFoundError middleware", () => {
  describe("When it receives a next function'", () => {
    test("Then it should call the recevived next function with a 404 'Endpoint not found'", () => {
      const next = jest.fn();

      notFoundError(null, res as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", 404);
    });
  });
});

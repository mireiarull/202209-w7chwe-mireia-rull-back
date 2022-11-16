import request from "supertest";
import app from "../app";

describe("Given a GET /hello non-existent endpoint", () => {
  describe("When it recevies a request", () => {
    test("Then it should respond qith a 404 'Endpoint not found'", async () => {
      const response = await request(app).get("/hola").expect(404);
      const errorMessage = "Endpoint not found";

      expect(response.body).toHaveProperty("error", errorMessage);
    });
  });
});

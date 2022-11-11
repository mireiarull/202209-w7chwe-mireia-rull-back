import type { Express } from "express";
import app from "./app";

app.disable("x-powered-by");

const startServer = async (app: Express, port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server);
    });

    server.on("error", (error) => {
      reject(error);
    });
  });

export default startServer;

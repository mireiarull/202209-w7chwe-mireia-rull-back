import "./loadEnvironment.js";
import chalk from "chalk";
import debugCreator from "debug";
import { mongo } from "mongoose";
import app from "./server/app.js";
import startServer from "./server/index.js";
import environment from "./loadEnvironment.js";
import connectDatabase from "./database/index.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { MongoServerError } = mongo;

const debug = debugCreator("items: server: root");

try {
  await startServer(app, Number(environment.port));
  debug(
    chalk.yellow(`Server listening on: http://localhost:${environment.port}`)
  );
  await connectDatabase(environment.mongoDbUrl);
  debug(chalk.green("Connection to database was successfull"));
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database ${(error as Error).message}`)
    );
  } else {
    debug(chalk.red(`Error starting the server ${(error as Error).message}`));
  }
}

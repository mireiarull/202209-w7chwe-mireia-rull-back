import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routers/usersRouter.js";
import { generalError, notFoundError } from "./middlewares/error.js";
import { ping } from "./middlewares/ping.js";

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(morgan("dev"));

app.get("/", ping);

app.use("/assets", express.static("assets"));

app.use(express.json());

// App.use(partialPaths.users.base, )
app.use("/users", userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

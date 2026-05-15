import "./instrument.js";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/dbConnect.js";
import corsOptions from "./config/corsOptions.js";
import { pinoHttp } from "pino-http";
import { logger } from "./lib/logger.js";

import errorHandler from "./middlewares/errorHandler.js";
import * as Sentry from "@sentry/node";
import rootRoute from "./routes/root.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.use(helmet({ contentSecurityPolicy: false }));
connectDB();

app.use(pinoHttp({ logger }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.use("/", rootRoute);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

app.all("/{*path}", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

mongoose.connection.once("open", () => {
  logger.info("Connected to MongoDB");
  app.listen(PORT, () => {
    logger.info({ port: PORT }, "Server started");
  });
});

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "mongo_connection_error");
});

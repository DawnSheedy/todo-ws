import { Express } from "express";
import { v1Api } from "../v1/api";
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParer = require("body-parser");
const app: Express = express();
const port = process.env.PORT ?? 8080;

app.use(cookieParser());

app.use(bodyParer.json());

app.get("/status", (_req, res) => res.sendStatus(200));

app.use("/api/v1", v1Api);

app.listen(port, () => {
  console.log(`📝 todo-ws listening on port ${port}`);
});

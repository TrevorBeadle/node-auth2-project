const express = require("express");
const server = express();
const morgan = require("morgan");
const helmet = require("helmet");
const usersRouter = require("../users/users-router");
const cookieParser = require("cookie-parser");

server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());
server.use(cookieParser());
server.use(usersRouter);

module.exports = server;

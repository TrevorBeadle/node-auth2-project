const express = require("express");
const server = express();
const morgan = require("morgan");
const helmet = require("helmet");

server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());

module.exports = server;

const express = require('express');

const server = express();

server.use(express.json());

//custom middleware
function logger(req, res, next) {
  console.log(
  `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  );
  next();
}

server.use(logger);

module.exports = server;

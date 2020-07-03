//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setting up server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;

// Database

// Schemas

// Models

// Test Data

// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

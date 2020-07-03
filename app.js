//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setting up server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const port = 3000;

// Database

// Schemas

// Models

// Test Data

// Home Routing
app.route('/')
.get((req, res) => {
  res.render('home');
});

// Login Routing
app.route('/login')
.get((req, res) => {
  res.render('login');
});

// Register Routing
app.route('/register')
.get((req, res) => {
  res.render('register');
});

// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

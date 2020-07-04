//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Setting up server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const port = 3000;

//  Database configuration
const dbURL = "mongodb://localhost:27017/covidDB"
mongoos.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

// Schemas
// Admin Schema
const adminSchema = new Schema({
  email: String,
  password: String,
  first_name: String,
  last_name: String
});

// User Schema
const userSchema = new Schema({
  email: String,
  password: String,
  first_name: String,
  last_name: String
});

// Report Schema
const reportSchema = new Schema({
  title: String
});

// Models
// Admin Model
const Admin = new mongoose.model('Admin', adminSchema)

// User Model
const User = new mongoose.model('User', userSchema)

// Report Model

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

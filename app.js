//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const date = require(__dirname + "/date.js");
const https = require("https");

// Setting up server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const port = 3000;

//  Database configuration
const dbURL = "mongodb://localhost:27017/covidDB"
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

// Schemas
// Admin Schema
const adminSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: String,
  last_name: String
});

// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: String,
  last_name: String
});

// Report Schema
const reportSchema = new Schema({
  date: String,
  daily_probability: Number,
  slope: Number,
  positive: Number,
  recovered: Number,
  mutation: Number
});

// Models
// Admin Model
const Admin = new mongoose.model('Admin', adminSchema)

// User Model
const User = new mongoose.model('User', userSchema)

// Report Model
const Report = new mongoose.model('Report', reportSchema)

// Creating an admin

/*
const newAdmin = new Admin({
  email: "admin@admin.com",
  password: "adminpassword",
  first_name: "Corona",
  last_name: 'Virus'
});
*/

// Home Routing
app.route('/')
.get((req, res) => {
  res.render('home');
});

// Login Routing
app.route('/login')
.get((req, res) => {
  res.render('login');
})
.post((req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if(err){
      console.log(err);
      res.redirect('/login');
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.redirect('report');
        }else{
          res.redirect('/login')
        }
      }else{
        res.redirect('/login')
      }
    }
  })

});

// Register Routing
app.route('/register')
.get((req, res) => {
  res.render('register');
})
.post((req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  });

  newUser.save((err) => {
    if(!err){
      res.redirect('/login');
    }else{
      res.send(err);
    }
  })
});

// Admin Login Routing
app.route('/admin')
.get((req, res) => {
  //newAdmin.save(); //Used to save our initial admin
  res.render('admin');
})
.post((req, res) =>{
  const username = req.body.username;
  const password = req.body.password;

  Admin.findOne({email: username}, (err, foundUser) => {
    if(err){
      console.log(err);
      res.redirect('/admin');
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.redirect('/adminpage');
        }else{
          res.redirect('/admin')
        }
      }else{
        res.redirect('/admin')
      }
    }
  })
});

// Admin Page Routing
app.route('/adminpage')
.get((req, res) => {
  res.render('adminpage');
});

// Report Routing
app.route('/report')
.get((req, res) => {
  res.render('report');
});

// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  //today = date.getDate();
  //console.log(`Todays date is: ${today}`);
})

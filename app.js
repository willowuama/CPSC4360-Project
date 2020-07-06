//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const date = require(__dirname + "/date.js");
const https = require("https");
const covid = require(__dirname + "/covid.js");

// Setting up server
const app = express();
app.use(express.static("public"));
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
  mutation: String
});

// News Schema
const newsSchema = new Schema({
  url: String
});

// Models
// Admin Model
const Admin = new mongoose.model('Admin', adminSchema)

// User Model
const User = new mongoose.model('User', userSchema)

// Report Model
const Report = new mongoose.model('Report', reportSchema)

// News Model
const News = new mongoose.model('News', newsSchema)

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

  Report.find({}, (err, foundItems) => {
    res.render('report', {reportList: foundItems})
  });

});

// Create Report Routing
app.route('/createreport')
.get((req, res) => {
  res.render('createreport');
})
.post((req, res) => {

  const mutation = req.body.mutation;
  const covidURL = "https://api.covid19api.com/summary";
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  https.get(covidURL, options, (response) => {
    var body = '';
    response.on('data', (chunk) => {
      body = body + chunk;
    })

    response.on('end', () => {
      const covidData = JSON.parse(body);
      console.log(covidData.Global.TotalConfirmed);

      const newReport = new Report({
        date: date.getDate(),
        daily_probability: covid.getProbability(covidData.Global.NewConfirmed, covidData.Global.TotalConfirmed),
        slope: covid.getSlope(covidData.Global.TotalConfirmed, covidData.Global.TotalRecovered),
        positive: covidData.Global.TotalConfirmed,
        recovered: covidData.Global.TotalRecovered,
        mutation: mutation
      });

      newReport.save((err) => {
        if(!err){
          res.redirect("/adminpage");
        }else{
          res.send(err);
        }
      })

    })

  })

});

// Add News route
app.route('/addnews')
.get((req, res) => {
  res.render('addnews');
})
.post((req, res) => {

  const newsURL = new News({
    url: req.body.news
  });

  newsURL.save((err) => {
    if(!err){
      res.redirect('/adminpage');
    }else{
      res.redirect('/addnews');
    }
  })

});

// News route
app.route('/news')
.get((req, res) => {
  News.find({}, (err, foundItems) => {
    res.render('news', {newsList: foundItems})
  });
});

// Individual report render
app.get('/report/:reportid', (req, res) => {
  const reportID = req.params.reportid;

  Report.findOne({_id: reportID}, (err, foundReport) => {
    if(!err){
      res.render('reportpage', {report: foundReport});
    }else{
      res.send(err)
    }
  })

})

// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

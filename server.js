// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
var cookieParser = require('cookie-parser'); // parse cookies
var session = require('express-session');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
// =============================================================
var db = require("./models");

//Sessions
app.use(session({
  secret: 'hdgfuiwqeyfbgjhd',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}))

// Sets up the Express app to handle data parsing
// =============================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.text({ type: 'text/xml' }))
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); // read cookies (needed for auth)

// Static directory
app.use(express.static("public"));



// Set Handlebars
// =============================================================
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "base" }));
app.set("view engine", "handlebars");


// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/fb-routes.js")(app, passport);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force:false }).then(function() {

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

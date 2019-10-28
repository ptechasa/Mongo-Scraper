// Initialize Express app
var express = require("express");
var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

//Require request and cheerio for making the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//automatically make a route for every single file in public folder
app.use(express.static(__dirname + '/public'));

// Database configuration
var mongojs = require("mongojs");
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Hook mongojs configuration to the db variable 
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    res.send("hello")
});



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on PORT " + port);
})
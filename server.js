//Initialize Express app
var express = require("express");
var app = express();

//Set the view engine to ejs
app.set("view engine", "ejs");

//Require request and cheerio for making the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");

//Set up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Automatically make a route for every single file in public folder
app.use(express.static(__dirname + '/public'));

//Database configuration
var mongojs = require("mongojs");
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Mongojs configuration to the db variable 
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    res.send("hello")
});

//Retrieve data from database
app.get("/all", function (req, res) {
    db.scrapedData.find({}, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});

//Scrape data from website
app.get('/scrape', function (req, res) {
    request.get("https://technewsinsight.com/category/tech-giants/", function (error, respose, body) {
        var $ = cheerio.load(body);
        $(".blog-category").each(function (i, element) {
            // console.log('hey', i)
            // console.log('oh', element)

            var title = $(this).children("ul").children("li").children(".blog-post-title-box").text();
            var link = $(this).children("h2").children("a").attr("href")

            console.log('haloo', title)
            console.log('haloo2', link)

            if (title && link) {
                db.scrapedData.save({
                    title: title,
                    link: link
                },
                    function (err, saved) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(saved)
                        }
                    })
            }
        })
    })

    res.send("Scrape Sucessful");
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on PORT " + port);
})
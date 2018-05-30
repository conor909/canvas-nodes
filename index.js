var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.set("port", 3000);

const staticDir = "/";

app.use(express.static(path.join(__dirname, staticDir)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app.get("port"), function() {
    console.log("Node server is running at: " + app.get("port"));
});

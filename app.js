var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use("/", express.static("public"));

MongoClient.connect(mongoUrl, function(err, db) {
	if (err) throw err;

	app.all("/", function(req, res, next) {
  		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Content-Type");
  		next();
 	});

	app.post("/", function(req, res) {
		console.log("Server received request");
		var coords = req.body.features[0].geometry.coordinates;
		var params = {
			"geometry.coordinates" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: coords
					}
				}
			}
		}
		console.log(JSON.stringify(params));
		//TODO: get rid of limit
		db.collection("caitlintestcollection").find(params, {limit: 100}).toArray(function(err, docs) {
			if (err) {
				console.log("ERROR");
				console.log(err);
			}
			console.log("here");
			res.json(docs);
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://mongo:27017";
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
		};
		//TODO: get rid of limit
		db.collection("earthquakes").find(params, {limit: 100}).toArray(function(err, docs) {
			//TODO: handle error
			res.json(docs);
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
		db.collection("earthquakes").findOne((err, doc) => {
			console.log(JSON.stringify(doc));
			console.log("pineapple");
		});
	});
});

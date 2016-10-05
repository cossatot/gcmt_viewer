var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://mongo:27017/gcmt_dev";
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
		var params = {
			"geometry.coordinates" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: req.body
					}
				}
			}
		};
		//TODO: get rid of limit
		db.collection("quakes").find(params, {limit: 100}).toArray(function(err, docs) {
			if (err) throw err;
			console.log("query:");
			console.log(JSON.stringify(params));
			console.log("result:");
			console.log(JSON.stringify(docs));
			res.json(docs);
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});

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

		db.collection("quakes").find(params).toArray(function(err, quakes) {
			if (err) throw err;
			var resArray = [];
			resArray = resArray.concat(quakes);
			res.json(resArray);
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});

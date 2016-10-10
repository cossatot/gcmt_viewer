var MongoClient = require("mongodb").MongoClient;
var mongoUrl = process.env.MONGODB_URI;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use("/", express.static("public"));

MongoClient.connect(mongoUrl || "mongodb://mongo:27017/gcmt_dev", function(err, db) {
	if (err) throw err;

	app.all("/", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		next();
	});

	app.post("/quakes", (req, res) => {
		var params = {
			"geometry" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: req.body.coordinates
					}
				}
			},
			"properties.minZoom" : {
				$lte: req.body.minZoom
			}
		};
		db.collection("quakes").find(params).toArray((err, quakes) => {
			if (err) throw err;
			res.json(quakes);
		});
	});

	app.post("/faults", (req, res) => {
		var params = {
			"geometry" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: req.body.coordinates
					}
				}
			}
		};
		db.collection("faults").find(params).toArray((err, faults) => {
			if (err) throw err;
			res.json(faults);
		});
	});

	app.listen(3000, () => {
	console.log("Server running on 3000");
	});
});

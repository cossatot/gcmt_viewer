var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

MongoClient.connect(mongoUrl, function(err, db) {
	if (err) throw err;

	app.all('/', function(req, res, next) {
  		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		next();
 	});

	app.post("/", function(req, res) {

		console.log("In / endpoint!");
		console.log(req.body);
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
		db.collection("caitlintestcollection").find(params).toArray(function(err, docs) {
			console.log("RESULTS FROM DB QUERY");
			console.log(docs);
			res.json(docs);
			console.log("Sent http response");
		});
		/**
		db.collection("caitlintestcollection").findOne({}, function(err, result) {
			if (err) {
				console.log("ERROR IN DB QUERY");
				throw err;
			}
			console.log("Made database call; result = ");
			console.log(result);
			console.log(JSON.stringify(result));
			res.json(result);
			console.log("Sent http response");
		});
		**/
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});

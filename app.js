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
  		//res.header("Access-Control-Allow-Headers", "X-Requested-With");
  		next();
 	});

	app.get("/", function(req, res) {

		console.log("In / endpoint!");
		console.log(req.body);

		db.collection("caitlintestcollection").findOne({}, function(err, result) {
			if (err) {
				console.log("ERROR IN DB QUERY");
				throw err;
			}
			console.log("Made database call; result = ");
			console.log(result);
			console.log(JSON.stringify(result));
			/**
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin" : "*"
			});
			**/
			//res.write(JSON.stringify({data : "pineapple"}));
			//res.write(JSON.stringify(result));
			res.json(result);
			//res.end();
			console.log("Sent http response");
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});

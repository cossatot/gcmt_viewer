var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev";
var express = require("express");
var app = express();

MongoClient.connect(mongoUrl, function(err, db) {
	if (err) throw err;

	app.get("/", function(req, res) {
		db.collection("caitlintestcollection").findOne({}, function(err, result) {
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin" : "*"
			});
			res.write(JSON.stringify({data : "pineapple"}));
			res.write(JSON.stringify(result));
			res.end();
		});
	});

	app.listen(3000, function() {
		console.log("Server running on 3000");
	});
});

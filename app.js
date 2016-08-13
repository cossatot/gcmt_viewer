var http = require("http");
var url = require("url");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var router = function(req, res) {
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
		});
		res.write(JSON.stringify({data : "pineapple"}));
		res.end();
	};
	var server = http.createServer(router);
	server.listen(3000);
});
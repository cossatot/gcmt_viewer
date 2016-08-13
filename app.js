var http = require("http");

var router = function(req, res) {
	res.writeHead(200, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
	});
	res.write(JSON.stringify({data : "pineapple"}));
	res.end();
}

var server = http.createServer(router);

server.listen(3000);

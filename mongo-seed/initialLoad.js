var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");

var url = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev?connectionTimeoutMS=360000000&socketTimeoutMS=360000000";

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log("ERROR");
    throw err;
  }
  
  var startTime = process.hrtime()[0];

  var quakesjson = JSON.parse(fs.readFileSync("./data/quakes_init.geojson", "utf8"));
  console.log("Starting to insert quakes file");
  db.collection("caitlinquakes").insertMany(quakesjson, (err, res) => {
    if (err) throw err;
    var totalTime = process.hrtime()[0] - startTime;
    console.log("All entries from quakes inserted OK");
  });

  var faultsjson = JSON.parse(fs.readFileSync("./data/faults_init.geojson", "utf8"));
  console.log("Starting to insert faults file");
  db.collection("caitlinfaults").insertMany(faultsjson, (err, res) => {
    if (err) throw err;
    var totalTime = process.hrtime()[0] - startTime;
    console.log("All entries from faults inserted OK");
  });
});

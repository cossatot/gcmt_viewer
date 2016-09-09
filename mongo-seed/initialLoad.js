var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");

var url = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev?connectionTimeoutMS=360000000&socketTimeoutMS=360000000";

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log("ERROR");
    throw err;
  }
  console.log("here");
  var filenames = ["ATA", "HimaTibetMap", "plate_bounds_bird02"];
  
  var startTime = process.hrtime()[0];

  /**
  var specialjson = JSON.parse(fs.readFileSync("./data/init.geojson", "utf8"));
  console.log("starting to insert init file");
  db.collection("caitlintestcollection").insertMany(specialjson, (err, res) => {
    if (err) throw err;
    var totalTime = process.hrtime()[0] - startTime;
    console.log("All entries from init inserted OK");
  });
  **/
  
  filenames.map((filename) => {
    var json = JSON.parse(fs.readFileSync("./data/" + filename + ".geojson", "utf8"));
    var features = json.features;
    console.log("Starting to insert " + filename);
    db.collection("caitlintestcollection").insertMany(features, (err, res) => {
      if (err) throw err;
      var totalTime = process.hrtime()[0] - startTime;
      console.log("All entries from " + filename + " inserted ok. Elapsed time is " + totalTime + " seconds.");
    });
  });
});

var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");

var url = "mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev?connectionTimeoutMS=360000000&socketTimeoutMS=360000000";

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log("ERROR");
    throw err;
  }
  console.log("here");
  var filenames = ["ATA", "HimaTibetMap", "gcmt_4-_icons", "gcmt_5-55_icons",
  "gcmt_5-6_icons", "gcmt_55-6_icons", "gcmt_6-7_icons", "gcmt_7+_icons",
  "gcmt_icons", "gcmt_icons_55plus", "gcmt_icons_60plus", "pb_steps",
  "plate_bounds_bird02"];
  
  var startTime = process.hrtime()[0];

  filenames.map((filename) => {
    var json = JSON.parse(fs.readFileSync("./data/" + filename + ".geojson", "utf8"));
    var features = json.features;
    console.log("Starting to insert " + filename);
    db.collection("caitlintestcollection").insertMany(features, (err, res) => {
      if (err) throw err;
      var totalTime = process.hrtime()[0] - startTime;
      console.log("All entries from " + filename + " inserted ok. Elapsed time is " + totalTime + " seconds.");
      /** Don't know why this part hangs
      db.collection("caitlintestcollection").count(function(err, res) {
          console.log("Total count is " + count);
          console.log("Insertion rate is " + (count/totalTime) + " records per second.");
      });
      **/
    });
  });
});

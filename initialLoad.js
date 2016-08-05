var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");

MongoClient.connect("mongodb://admin:segfault@ds145355.mlab.com:45355/gcmt_dev", function(err, db) {
  if (err) {
    console.log("ERROR");
    throw err;
  }
  console.log("here");
  var filenames = ["ATA", "HimaTibetMap", "gcmt_4-_icons", "gcmt_5-55_icons",
  "gcmt_5-6_icons", "gcmt_55-6_icons", "gcmt_6-7_icons", "gcmt_7+_icons",
  "gcmt_icons", "gcmt_icons_55plus", "gcmt_icons_60plus", "pb_steps",
  "plate_bounds_bird02"];

  filenames.map((filename) => {
    var json = JSON.parse(fs.readFileSync("./data/" + filename + ".geojson", "utf8"));
    var features = json.features;
    console.log("AND HERE");
    db.collection("table1").insertMany(features, (err, res) => {
      console.log("Got a result");
      if (err) throw err;
      console.log(res + " inserted ok");
    });
  });
});

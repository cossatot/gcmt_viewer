L.mapbox.accessToken = 'pk.eyJ1IjoiY29zc2F0b3QiLCJhIjoiVGJyMGU5cyJ9.CMKdx74guBSUyyC-L1fAoA';

var map = L.mapbox.map('map', 'mapbox.streets-satellite', {
//    minZoom: 5,
    tileLayer: {
        continuousWorld: false,
        noWrap: true
        }
    }).setView([48.103803, -121.965733], 6);
//    }).setView([ -65.708372954999959, 12.474644874000035 ], 6);

L.control.attribution().addTo(map)
  .addAttribution('CMTs from globalcmt.org; faults from ATA, HimaTibetMap, plate boundaries from Bird 2003');

//TODO: Uncomment this and make sure it doesn't throw a CORS error
/**
var HTM_url = './data/HimaTibetMap.geojson';
var ATA_url = './data/ATA.geojson';
var PB_url = './data/plate_bounds_bird02.geojson';

$.getJSON(HTM_url, function(htm_data) {
    HTM = L.mapbox.featureLayer(htm_data);
    HTM.addTo(map);
    HTM.setStyle({color: 'red'})
    });

$.getJSON(ATA_url, function(htm_data) {
    ATA = L.mapbox.featureLayer(htm_data);
    ATA.addTo(map);
    ATA.setStyle({color: 'red'})
    });

var PB = L.mapbox.featureLayer().loadURL(PB_url).addTo(map);
**/

/** FOR TESTING!!! **/
var testFeature = {
  "type": "Feature",
  "properties": {
    "OBJECTID": 3,
    "LINETYPE": 1,
    "SHAPE_Leng": 10.690348,
    "Fault_Name": null,
    "Source": null,
    "Slip_Rate": null,
    "Convention": 1111,
    "ltype": 0
  },
  "geometry": {
    "type": "MultiLineString",
    "coordinates": [
      [
        [
          -63.978022201999977,
          12.264905389000035
        ],
        [
          -64.358175018999987,
          12.330448978000049
        ],
        [
          -64.987393474999976,
          12.422210003000032
        ],
        [
          -65.708372954999959,
          12.474644874000035
        ],
        [
          -66.167178078999939,
          12.631949488000032
        ],
        [
          -66.770179098999961,
          12.920341280000059
        ],
        [
          -67.451832424999964,
          13.326711532000047
        ]
      ],
      [
        [
          -67.556702167999958,
          13.392255121000062
        ],
        [
          -68.264572929999986,
          13.484016146000045
        ],
        [
          -68.893791385999975,
          13.588885889000039
        ],
        [
          -69.62787958399997,
          13.654429478000054
        ],
        [
          -70.584815984999977,
          13.746190503000037
        ],
        [
          -71.47620879699997,
          13.706864349000057
        ],
        [
          -72.14475340599995,
          13.680646913000032
        ],
        [
          -72.931276474999947,
          13.62821204200003
        ],
        [
          -73.390081598999984,
          13.352928968000072
        ],
        [
          -73.717878781999957,
          12.90242170700003
        ],
        [
          -73.848886721999975,
          12.763036666000062
        ],
        [
          -74.058626206999975,
          12.527079745000037
        ]
      ]
    ]
  }
};

/**
var polyline = L.multiPolyline(testFeature.geometry.coordinates, {color: "red"}).addTo(map);
map.fitBounds(polyline.getBounds());
**/

var test = L.mapbox.featureLayer();
test.addLayer(L.geoJson(testFeature, { color: 'red', weight: 1.5, opacity: 1}));
test.addTo(map);
//test.setStyle({color: 'red'});
console.log("done");

/**
addMarkersToMap(map);

map.on("moveend", function(e) {
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  $.when(getMarkersFromDB(map)).done((features) => {
    var currentZoom = map.getZoom();
    features = features.filter(feature =>
      //TODO: add minZoom filter
      true
    );

    var markers = L.layerGroup();

    features.forEach(feature => {
      if (feature.geometry.type == "Point") {
        L.marker(
            [feature.geometry.coordinates[1],
             feature.geometry.coordinates[0]],
            {icon: L.icon(feature.properties.icon)}
          ).bindPopup(feature.properties.title).addTo(map);
      } else if (feature.geometry.type == "MultiLineString") {
        console.log("MultiLineString returned!");
        L.multiPolyline(feature.geometry.coordinates, {color: "red"}).addTo(map);

      } else {
        console.log("LineString returned!");
        // type == "LineString"
        L.polyline(feature.geometry.coordinates, {color: "red"}).addTo(map);
      }
    });
    map.addLayer(markers);
  });
}

function getMarkersFromDB(map) {
  var currentBbox = getBboxCoords(map);
  return $.ajax({
    url : "http://localhost:3000/",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data : JSON.stringify(currentBbox)
  });
}

function getBboxCoords(map) {
  var currentBbox = map.getBounds();
  return [[
    [currentBbox._southWest.lng, currentBbox._southWest.lat],
    [currentBbox._southWest.lng, currentBbox._northEast.lat],
    [currentBbox._northEast.lng, currentBbox._northEast.lat],
    [currentBbox._northEast.lng, currentBbox._southWest.lat],
    [currentBbox._southWest.lng, currentBbox._southWest.lat]]];
}
**/

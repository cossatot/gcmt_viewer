/* global L window $*/

L.mapbox.accessToken = "pk.eyJ1IjoiY29zc2F0b3QiLCJhIjoiVGJyMGU5cyJ9.CMKdx74guBSUyyC-L1fAoA";

var map = L.mapbox.map("map", "mapbox.streets-satellite", {
    minZoom: 5,
    tileLayer: {
        continuousWorld: false,
        noWrap: true
        }
    }).setView([48.103803, -121.965733], 6);

L.control.attribution().addTo(map)
  .addAttribution("CMTs from globalcmt.org; faults from ATA, HimaTibetMap, plate boundaries from Bird 2003");

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

addMarkersToMap(map);

map.on("moveend", (err) => {
  if (err) { console.log(err); }
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  $.when(getMarkersFromDB(map)).done((features) => {
    var currentZoom = map.getZoom();
    features = features.filter((feature) => {
      return (feature.properties.minZoom <= currentZoom);
    });

    var markers = L.mapbox.featureLayer();

    features.forEach((feature) => {
      if (feature.geometry.type == "Point") {
        console.log("Point");
        L.marker(
            [feature.geometry.coordinates[1],
             feature.geometry.coordinates[0]],
            {icon: L.icon(feature.properties.icon)}
          ).bindPopup(feature.properties.title).addTo(map);
      } else if (feature.geometry.type == "MultiLineString") {
        console.log("MultiLineString");
        markers.addLayer(L.geoJson(feature, { color: "red", weight: 1.5, opacity: 1}));
      } else {
        console.log("LineString");
        markers.addLayer(L.geoJson(feature, { color: "red", weight: 1.5, opacity: 1}));
      }
    });

    markers.addTo(map);
  });
}

function getMarkersFromDB(map) {
  var currentBbox = getBboxCoords(map);
  return $.ajax({
    url : window.location.href,
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

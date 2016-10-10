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

var beachballs = L.mapbox.featureLayer();
var faultlines = L.mapbox.featureLayer();
beachballs.addTo(map);
faultlines.addTo(map);

addMarkersToMap(map);

map.on("moveend", () => {
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  // TODO: should these be linked with $.when ?
  // evaluate for concurrency issues!
  addBeachballsToMap(map);
  addFaultlinesToMap(map);
}

function addBeachballsToMap(map) {
  beachballs.clearLayers();
  $.when(getQuakesFromDB(map)).done((quakes) => {
    quakes.forEach((quake) => {
      beachballs.addLayer(
        L.marker(
          [quake.geometry.coordinates[1],
           quake.geometry.coordinates[0]],
          {icon: L.icon(quake.properties.icon)}
        ).bindPopup(quake.properties.title)
      )
    });
  });
}

function addFaultlinesToMap(map) {
  faultlines.clearLayers();
  $.when(getFaultsFromDB(map)).done((faults) => {
    faults.forEach((fault) => {
      faultlines.addLayer(
        L.geoJson(
          fault, 
          {color: "red", 
          weight: 1.5, 
          opacity: 1}
        )
      );
    });
  });
}

function getQuakesFromDB(map) {
  var currentBbox = getBboxCoords(map);
  var currentZoom = map.getZoom();
  return $.ajax({
    url: window.location.href + "quakes",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "coordinates" : currentBbox,
      "minZoom" : currentZoom
    })
  });
}

function getFaultsFromDB(map) {
  var currentBbox = getBboxCoords(map);
  return $.ajax({
    url: window.location.href + "faults",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "coordinates" : currentBbox
    })
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
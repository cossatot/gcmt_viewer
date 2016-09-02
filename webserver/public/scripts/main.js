/**
var map = L.map( 'map', {
  center: [48.103803, -121.965733],
  minZoom: 5,
  zoom: 6
});
**/

L.mapbox.accessToken = 'pk.eyJ1IjoiY29zc2F0b3QiLCJhIjoiVGJyMGU5cyJ9.CMKdx74guBSUyyC-L1fAoA';
var map = L.mapbox.map('map', 'mapbox.streets-satellite', {
    minZoom: 5,
    // These options apply to the tile layer in the map.
    tileLayer: {
        // This map option disables world wrapping. by default, it is false.
        continuousWorld: false,
        // This option disables loading tiles outside of the world bounds.
        noWrap: true
        }
    }).setView([48.103803, -121.965733], 6);

L.control.attribution().addTo(map)
  .addAttribution('CMTs from globalcmt.org; faults from ATA, HimaTibetMap, plate boundaries from Bird 2003');

addMarkersToMap(map);

map.on("zoomend", function() {
  console.log("Zoomed!");
  //TODO: Filter current dataset on minZoom
});

map.on("dragend", function() {
  console.log("Dragged!");
  //TODO: Query database for new markers
});

map.on("moveend", function(e) {
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  $.when(getMarkersFromDB(map)).done((features) => {
    var currentZoom = map.getZoom();
    var gcmtAboveMinZoom = features.filter(feature =>
      true
    );
    //L.geoJson(gcmtAboveMinZoom).addTo(map);
    var markers = L.layerGroup();
    for (var i = 0; i < gcmtAboveMinZoom.length; ++i) {
      var popup = gcmtAboveMinZoom[i].properties.title;
      var m = L.marker([gcmtAboveMinZoom[i].geometry.coordinates[1],
                        gcmtAboveMinZoom[i].geometry.coordinates[0]],
                        {icon: L.icon(gcmtAboveMinZoom[i].properties.icon)})
                      .bindPopup( popup );
      markers.addLayer(m);
    }
    map.addLayer(markers);
  });
}

//TODO: update this method too
function getMarkersFromDB(map) {
  var currentBbox = boundsToGeoJSON(map);
  return $.ajax({
    url : "http://localhost:3000/",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data : JSON.stringify(currentBbox)
  });
}

function boundsToGeoJSON(map) {
  var currentBbox = map.getBounds();
  return [
    [
      // SW
      [
        currentBbox._southWest.lng,
        currentBbox._southWest.lat
      ],
      // NW
      [
        currentBbox._southWest.lng,
        currentBbox._northEast.lat
      ],
      // NE
      [
        currentBbox._northEast.lng,
        currentBbox._northEast.lat
      ],
      // SE
      [
        currentBbox._northEast.lng,
        currentBbox._southWest.lat
      ],
      // back to SW
      [
        currentBbox._southWest.lng,
        currentBbox._southWest.lat
      ]
    ]
  ];
}

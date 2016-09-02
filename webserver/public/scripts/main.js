var map = L.map( 'map', {
  center: [48.103803, -121.965733],
  minZoom: 5,
  zoom: 6
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
 subdomains: ['a','b','c']
}).addTo( map );

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

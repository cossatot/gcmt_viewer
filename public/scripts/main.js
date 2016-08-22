// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps

var map = L.map( 'map', {
  center: [48.103803, -121.965733],
  minZoom: 5,
  zoom: 6
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
 subdomains: ['a','b','c']
}).addTo( map );

var myURL = jQuery( 'script[src$="main.js"]' ).attr( 'src' ).replace( 'main.js', '' );

var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

addMarkersToMap(map);

map.on("moveend", function(e) {
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  $.when(getMarkersFromDB(map)).done((markers) => {
    console.log("markers");
    console.log(markers);
    var markerClusters = L.markerClusterGroup();
    for ( var i = 0; i < markers.length; ++i )
    {
      var popup = markers[i].properties.title;

      var m = L.marker([markers[i].geometry.coordinates[1], 
                        markers[i].geometry.coordinates[0]], 
                        {icon: myIcon})
                      .bindPopup( popup );

      markerClusters.addLayer( m );
    }
    map.addLayer( markerClusters );
    console.log("done with addMarkerSubset");
  });
}


function getMarkersFromDB(map) {
  var currentBbox = boundsToGeoJSON(map);
  console.log(currentBbox);
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
  var bboxGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
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
          ]
        }
      }
    ]
  }
  return bboxGeoJSON;
}
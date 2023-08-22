// Store our API endpoint as queryUrl.
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // send the data.features object to the createFeatures function.
  createFeatures(data);
});

function createFeatures(earthquakeData) {



function chooseColor(mag) {
    if (mag >= 0.05) return "red";
    else if (mag >= 1.0) return "orange";
    else return "yellow";
  }
  

coords = [];

function onEachFeature(feature, layer) {

    coords.push(
    L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        stroke: true,
        weight: .8,
        color: "grey",
        fillColor: chooseColor(feature.properties.dmin),
        fillOpacity: 0.9,
        opacity: 0.9,
        radius: feature.properties.mag*3
      }).bindPopup(`<b>${feature.properties.place}<b/><hr><p>
                <b>Magnitude:<b/> ${feature.properties.mag.toLocaleString('en-US', {minimumFractionDigits: 1, useGrouping: false})}<br>
                <b>Depth:<b/> ${(feature.properties.dmin*69.069).toLocaleString('en-US', {minimumFractionDigits: 1, useGrouping: false})} miles</p>`));
  }
  
  // Creates a GeoJSON layer containing the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  earthquakes = L.layerGroup(coords);

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.753098, -100.024872],
    zoom: 5,
    layers: [street, earthquakes]
  });

  function getColor(x) {
    return x > 9 ? "darkred" :
           x > 6  ? "red" :
           x > 4  ? "orange" :
           x > 2  ? "yellow" :
           x > 1   ? "gold" :
           x > 0   ? "green" :
                       'white';
  }


function getColor(mag) {
    // green to red color scale.
    return mag>= 10 ? 'red' :
        mag >= 8 ? 'darkred' :
        mag >= 6 ? 'orangered' :
        mag >= 4 ? 'orange' :
        mag >= 2 ? 'gold' :
        'green';
}

let legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2, 4, 6, 8, 10], 
        labels = ['<strong>&nbspLEGEND&nbsp</strong><br>&nbspMagnitude&nbsp'],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+')
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(myMap);


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: ''
});

var googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var map = L.map("map", {
    center: [31.0461, 34.8516],
    zoom: 8,
    layers: [osm]
});

var addrInput = document.getElementById('address'),
    latInput = document.getElementById('latitude'),
    lngInput = document.getElementById('longitude');

let apiKey = 'AAPKc0c87d407f13489e8eba2b5449565debSspdMmRY-Ogc7YtF7Fj9Ljcf9Z3XP3YQvt7i5hderFKdHtXpTM3MEEg9RJ2RnvxP';
let nearby = {
    lat: 50.5,
    lng: 52.5
};

function onEachMarker(feature, layer) {
    var icon = setIcon();
    layer.setIcon(icon);
}

var draggableMarker = L.marker(nearby, {
    draggable: true,
    icon: L.divIcon({className: 'my-google-icon', html: '<i class="material-icons g-icon-i" style="font-size:32px; color: #ff0000">place</i>'})
}).addTo(map).on('dragend', onDragEnd);

var searchControl = L.esri.Geocoding.geosearch({
    position: 'topright',
    placeholder: 'Enter an address or place e.g. 1 York St',
    useMapBounds: false,
    providers: [L.esri.Geocoding.arcgisOnlineProvider({
        apikey: apiKey, // replace with your api key - https://developers.arcgis.com
        nearby: nearby
    })]
}).addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng).bindPopup(data.results[i].properties.LongLabel).openPopup());
        // console.log(data.results[i]);

        draggableMarker.setLatLng(data.results[i].latlng);
        
        latInput.value = data.results[i].latlng.lat;
        lngInput.value = data.results[i].latlng.lng;
        addrInput.value = data.results[i].properties.LongLabel;
    }
});


var baseLayers = {
    'OSM': osm,
    'Google Street': googleStreets,
    'Google Hybrid': googleHybrid,
    'Google Terrain': googleTerrain,
};
var layerControl = L.control.layers(baseLayers).addTo(map);

function onDragEnd(event) {
    var latlng = event.target.getLatLng();

    displayLatLng(latlng);
}

function displayLatLng(latlng) {
    latInput.value = latlng.lat;
    lngInput.value = latlng.lng;
}
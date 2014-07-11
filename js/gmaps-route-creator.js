/**
 * Created by higorsilvarosa on 10/07/14.
 */


// Adiciona nova coordenada à lista
function addCoordinate(coordinate, index){
    if(index == null) {
        coordinates.push(coordinate);
    }
}


// Exibe lista de coordenadas adicionadas
function listCoordinates(){
    $("#coordinates").empty();
    for (c in coordinates){
        $("#coordinates").append('<li class="list-group-item">' +
            '<span class="glyphicon glyphicon-map-marker"></span> ' +
            coordinates[c]["lat"]+", "+coordinates[c]["lng"]+
            '</li>');
    }
}


// Desenha Polyline no mapa --> INUTILIZADA
function drawRoute(){
    var gmapsCoordinates = [];
    for (c in coordinates){
        gmapsCoordinates.push(new google.maps.LatLng(coordinates[c]["lat"], coordinates[c]["lng"]));
    }
    route.setPath(gmapsCoordinates);
}


function calculateRoute() {

    var gmapsCoordinates = [];
    for (c in coordinates){
        gmapsCoordinates.push(new google.maps.LatLng(coordinates[c]["lat"], coordinates[c]["lng"]));
    }

    var waypoints = [];
    for (g in gmapsCoordinates){
        waypoints.push({
            location: gmapsCoordinates[g],
            stopover: true
        });
    }

    var selectedMode = $("#travel-mode").val()

    var request = {
        origin: gmapsCoordinates[0],
        destination: gmapsCoordinates[gmapsCoordinates.length-1],
        waypoints: waypoints,
        travelMode: google.maps.TravelMode[selectedMode]
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        else{
            console.log("Google Directions Service falhou!")
        }
    });
}

function initialize() {

    //Criando mapa
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(-14.2400732, -53.1805017),
        disableDoubleClickZoom: true
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    //Adicionando listener de clipe duplo
    google.maps.event.addListener(map, "dblclick", function (event) {
        var coordinate = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }
        //console.log( latitude + ', ' + longitude );

        addCoordinate(coordinate, index);
        listCoordinates();
        calculateRoute();
        drawRoute();
    });

    route = new google.maps.Polyline({
        //path: gmapsCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
        map:map
    });


}
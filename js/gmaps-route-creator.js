/**
 * Created by higorsilvarosa on 10/07/14.
 */


// Adiciona nova coordenada à lista
function addCoordinate(coordinate, index){
    if(index == null) {
        coordinates.push(coordinate);
    }
}

function removeLastCoordinate(coordinate, index){
    if (coordinates.length > 0){
        if(index == null) {
            coordinates.pop();
            return true;
        }

    }
    else{
        console.log("Não tem nenhuma coordenada selecionada ainda!");
        return false;
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

function centerAddress(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(16);
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
        if (useDirectionsService) {
            calculateRoute();
        }
        else{
            drawRoute();
        }
    });

    $("#travel-mode").change(function(){
        if (useDirectionsService){
            calculateRoute();function codeAddress(address) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var myOptions = {
                zoom: 8,
                center: results[0].geometry.location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}
        }
    });

    $("#use-directions-service").click(function(){
        if ($("#use-directions-service").is(":checked")){
            useDirectionsService = true;
            $("#google-maps-directions-service-options").show();
        }
        else{
            useDirectionsService = false;
            $("#google-maps-directions-service-options").hide();
        }
    });

    $("#remove-last-coordinate").click(function(){
        if (removeLastCoordinate()){
            listCoordinates();
            if (useDirectionsService && coordinates.length > 0) {
                calculateRoute();
            }
            else{
                drawRoute();
            }
        }
    });

    $("#search-address-form").submit(function(event){
        var adress = $("#search-address-field").val();
        centerAddress(adress);
        event.preventDefault();
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
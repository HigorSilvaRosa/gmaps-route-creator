/**
 * Created by higorsilvarosa on 10/07/14.
 */

function initialize() {

    //Criando mapa
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(-34.397, 150.644),
        disableDoubleClickZoom: true
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    //Adicionando listener de clipe duplo
    google.maps.event.addListener(map, "dblclick", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log( latitude + ', ' + longitude );
        event.stop();
    });
}
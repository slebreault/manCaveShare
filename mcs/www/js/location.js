
$(function(){
    document.addEventListener("DOMContentLoaded", onDeviceReady, false);
    document.addEventListener("deviceready", onDeviceReady, false);
})

function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var map, infoWindow;

function initMap() {

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7357, lng: -74.1724},
        scrollwheel: false,
        zoom: 13
    })
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Your Location');
        infoWindow.open(map);
        map.setCenter(pos);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
    }

    $.getJSON("https://mancave-fb4d9.firebaseio.com/mancaves/.json?print=pretty", function(dataset) {
        $.each(dataset, function(key, data) {
            var latLng = new google.maps.LatLng(data.latitude, data.longitude); 
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: data.name,
                animation: google.maps.Animation.DROP
            });
            var details = {
                name: data.name,
                photo_url: data.photo_url 
            }
            showInfoWindow(marker, map, infoWindow, details);
        });
    });

}

function showInfoWindow(marker, map, infoWindow, details) {
    google.maps.event.addListener(marker, 'click', function() {
        if (details.photo_url != null) {
            var content = details.name + "<br>" + "<center><img src='" + details.photo_url + "' height=40 width=60></center>";
            infoWindow.setContent(content);
        }
        else { 
            infoWindow.setContent(details.name);
        }

        infoWindow.open(map, marker);
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}    

//google.maps.event.addDomListener(window, 'load', initialize);



function compatible(elem,frase){
        console.log(elem);
        writeElement = document.getElementById(elem);
        writeElement.innerHTML = frase;
}

if (Modernizr.geolocation) {
    compatible("geo","Compatible con geolocalizacion.")

    var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;

        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');

        var mapDivUser = document.getElementById("mapUser");

        var map = new google.maps.Map(mapDivUser, {
            center: {lat: crd.latitude, lng: crd.longitude},
            zoom: 18
        });

    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
};

$(document).ready(function() {
    $("#myCarousel").hide();
});

var stations = [
    {
    name: "Nihonbashi",
    lat: 35.683611, 
    lng: 139.774444,
    },
    {
    name: "Shinagawa-juku",
    lat: 35.621944, 
    lng: 139.739167,
    }
];

window.onload = initialize;

function initialize() {  

    var mapOptions = {
        zoom: 9,
        center: new google.maps.LatLng(35.3606, 138.7278),
        mapTypeControl: false,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  

    setMarkers(stations);

}


function setMarkers(location) {

    for(i=0; i<location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          title: location[i].title,
          icon: {
            url: 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            },
          shape: {
            coords: [1,25,-40,-25,1],
            type: 'poly'
          }
        });
    }

}


var viewModel = {
    filter: ko.observable("")
};


viewModel.stations = ko.dependentObservable(function() {
    var filter = this.filter();
    return ko.utils.arrayFilter(stations, function(station) {
       return station.name.toLowerCase().indexOf(filter) !== -1
    });
}, viewModel);


ko.applyBindings(viewModel);


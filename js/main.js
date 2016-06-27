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


var infowindow;

function initialize() {  

    infowindow = new google.maps.InfoWindow({
                      content:"Hello World!"
                     });

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

    for(var i=0; i<location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          name: location[i].name,
          animation: google.maps.Animation.DROP, 
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

        location[i].holdMarker.addListener('click', function() {
            console.log('click');

//bounce the clicked maker
/*
  if (location[i].holdMarker.getAnimation() !== null) {
    location[i].holdMarker.setAnimation(null);
  } else {
    location[i].holdMarker.setAnimation(google.maps.Animation.BOUNCE);
  }
*/

            // perform ajax request

            // open google maps infowindow

  var infowindow = new google.maps.InfoWindow({
                      content:"Hello World!"
  });

  infowindow.open(map,location);

        });
    }

}

var viewModel = {
    filter: ko.observable(""),
    listItemClick: function(station) {
        google.maps.event.trigger(station.holdMarker, 'click');
    }
};


viewModel.stations = ko.dependentObservable(function() {
    var filter = this.filter();
    return ko.utils.arrayFilter(stations, function(station) {
        // hide all map markers
        if (station.holdMarker) {
            station.holdMarker.setVisible(false);
        }

        if (station.name.toLowerCase().indexOf(filter) !== -1) {
            // show the map marker
            if (station.holdMarker) {
                station.holdMarker.setVisible(true);
            }
            // add the map marker to the list
            return station;
        }

    });
}, viewModel);


ko.applyBindings(viewModel);


var stations = [
    {
    name: "Nihonbashi",
    keyword: "Tokaido_Nihonbashi2",
    lat: 35.683611, 
    lng: 139.774444,
    url: "https://en.wikipedia.org/wiki/Nihonbashi"
    },
    {
    name: "Shinagawa-juku",
    keyword: "Tokaido01_Shinagawa",
    lat: 35.621944, 
    lng: 139.739167,
    url: "https://en.wikipedia.org/wiki/Shinagawa-juku"
    },
    {
    name: "Kawasaki-juku",
    keyword: "Tokaido02_Kawasaki",
    lat: 35.535556, 
    lng: 139.707778,
    url: "https://en.wikipedia.org/wiki/Kawasaki-juku"
    },
    {
    name: "Kanagawa-juku",
    keyword: "Tokaido03_Kanagawa",
    lat: 35.472778, 
    lng: 139.632278,
    url: "https://en.wikipedia.org/wiki/Kanagawa-juku"
    },
    {
    name: "Hodogaya-juku",
    keyword: "Tokaido04_Hodogaya",
    lat: 35.444028, 
    lng: 139.595556,
    url: "https://en.wikipedia.org/wiki/Hodogaya-juku"
    },
    {
    name: "Totsuka-juku",
    keyword: "Tokaido05_Totsuka",
    lat: 35.395028, 
    lng: 139.529861,
    url: "https://en.wikipedia.org/wiki/Totsuka-juku"
    },
    {
    name: "Fujisawa-shuku",
    keyword: "Tokaido06_Fujisawa",
    lat: 35.345667, 
    lng: 139.486306,
    url: "https://en.wikipedia.org/wiki/Fujisawa-shuku"
    },
    {
    name: "Hiratsuka-juku",
    keyword: "Tokaido07_Hiratsuka",
    lat: 35.327278, 
    lng: 139.337806,
    url: "https://en.wikipedia.org/wiki/Hiratsuka-juku"
    },
    {
    name: "Ōiso-juku",
    keyword: "Tokaido08_Oiso",
    lat: 35.309, 
    lng: 139.315306,
    url: "https://en.wikipedia.org/wiki/%C5%8Ciso-juku"
    },
    {
    name: "Odawara-juku",
    keyword: "Tokaido09",
    lat: 35.248722, 
    lng: 139.161028,
    url: "https://en.wikipedia.org/wiki/Odawara-juku"
    }
];


var infowindow;

function initialize() {  

    infowindow = new google.maps.InfoWindow;

    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(35.472778, 139.632278),
        mapTypeControl: false,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  

    setMarkers(stations);

    //Resize Function
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
    
}


function setMarkers(location) {

    for(var i=0; i<location.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          keyword: location[i].keyword,
          url: location[i].url,
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

        location[i].holdMarker = marker;

        marker.addListener('click', function() {
            //console.log(this);

            this.setAnimation(google.maps.Animation.BOUNCE);
            stopAnimation(this);

            setInfoWindow(map, this);

        });
    }
}

// Stop marker bouncing at the 2nd time.
function stopAnimation(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 1400);
}

// Call Flickr API and get Photo URL
function setInfoWindow(vmap, marker) {
        var flickr;
        var photurl;
        var content;
        var sourceurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4fa0d52b3b38c8e04dd7e15efc8e2843&text=' + marker.keyword + '&format=json';
        $.ajax({
            url: sourceurl,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function(data) {
                flickr = data.photos.photo;
                photourl = 'https://farm' + flickr[0].farm + '.staticflickr.com/' + flickr[0].server + '/' + flickr[0].id + '_' + flickr[0].secret + '.jpg';
                content = marker.name + '<br/>' + '<a href="' + marker.url + '" target="_blank"><img alt="' + marker.name + '" src=' + photourl + '"/></a>';
                infowindow.setContent(content);
                infowindow.open(vmap, marker);
                        },
            error: function() {
                content = 'no data';
                infowindow.setContent(content);
                infowindow.open(vmap, marker);
            }
        });
}

var viewModel = {
    filter: ko.observable(""),
    listItemClick: function(station) {
        google.maps.event.trigger(station.holdMarker, 'click');
    }
};


viewModel.stations = ko.dependentObservable(function() {

    var filter = this.filter().toLowerCase();

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

// Alert when no google map api is not loadable.
function googleError() {
    alert("Sorry, can't load Google MAP API now.\nTry this application later.\nThank you!")
}

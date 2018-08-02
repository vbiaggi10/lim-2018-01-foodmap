var map;
var infowindow;

function initMap() {
	navigator.geolocation.getCurrentPosition(function (pos) {

		latitude = pos.coords.latitude;
		longitude = pos.coords.longitude;

		var pyrmont = new google.maps.LatLng(latitude, longitude);

		map = new google.maps.Map(document.getElementById("map"), {
			center: pyrmont,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.MAP
		});

		infowindow = new google.maps.InfoWindow();

		var request = {
			location: pyrmont,
			radius: 500,
			types: ['restaurant', 'food']
		};

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, callback);
		// service.textSearch(request, callback);
	});
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: 'img/location1.png',
		title: place.name,
	});
	console.log(place);
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}
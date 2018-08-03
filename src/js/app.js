let map;
let infowindow;
var markers = [];
let placesList = document.querySelector('.places-list');
placesList.innerHTML = '';
const searchPlaces = document.querySelector('#search');

function initMap() {
	navigator.geolocation.getCurrentPosition(function (pos) {

		latitude = pos.coords.latitude;
		longitude = pos.coords.longitude;

		let pyrmont = new google.maps.LatLng(latitude, longitude);

		map = new google.maps.Map(document.getElementById("map"), {
			center: pyrmont,
			zoom: 15.5,
			mapTypeId: google.maps.MapTypeId.roadmap
		});

		infowindow = new google.maps.InfoWindow();

		let request = {
			location: pyrmont,
			radius: 500,
			types: ['restaurant', 'food']
		};

		let service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, callback);
		// service.textSearch(request, callback);
	});
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (let i = 0; i < results.length; i++) {
			createMarker(results[i]);
			paintPlaces(results[i]);
		}
		let places = results;
		searchPlaces.addEventListener('keyup', () => {
			search = searchPlaces.value;

			function filterPlaces(places) {
				return (places.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || places.vicinity.toLowerCase().indexOf(search.toLowerCase()) > -1);
			}
			let placesSearched = places.filter(filterPlaces);
			placesList.innerHTML = '';
			deleteMarker();
			for (let i = 0; i < placesSearched.length; i++) {
				createMarker(placesSearched[i]);
				paintPlaces(placesSearched[i]);
			}
		})
	}
}

function createMarker(place) {
	// marker.setMap(null);
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: 'img/location1.png',
		title: place.name,
		animation: google.maps.Animation.BOUNCE,
	});
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
	markers.push(marker);
}

function deleteMarker() {
	for (removingMarkers in markers) {
		markers[removingMarkers].setMap(null);
	}
}

const paintPlaces = (place) => {
	console.log(place)
	let photo, rating, status, direction;
	let photos = place.photos;
	/* if (!photos) {
		return photos = 'img/suspicious.png';
	} */

	if (place.hasOwnProperty('photos')) {
		photo = photos[0].getUrl({
			'maxWidth': 300,
			'maxHeight': 300
		});
		// p1.innerHTML = place.photos[0].html_attributions[0];
	} else {
		photo = 'img/location.png';
	}
	if (place.hasOwnProperty('opening_hours')) {
		if (place.opening_hours.open_now === false) {
			status = 'Cerrado';
		} else if (place.opening_hours.open_now === true) {
			status = 'Abierto';
		}
	} else {
		status = ' - ';
	}
	if (place.hasOwnProperty('rating')) {
		rating = place.rating;
	} else {
		rating = ' - ';
	}
	if (place.hasOwnProperty('vicinity')) {
		direction = place.vicinity;
	} else {
		direction = ' - ';
	}

	const placeContainer = document.createElement('div');
	placeContainer.setAttribute('class','col s12 m6 l4 place-container')

	placeContainer.innerHTML = `
	<div class="container-photo card">
		<div class="card-image">
			<a class="modal-trigger" href="#modal1${place.place_id}"><img src="${photo}" alt="${place.name}" class="card photo" style="width:100%"></a>
			<span class="card-title modal-trigger" href="#modal1${place.place_id}">${place.name}</span>
			<!-- <a class="card waves-effect waves-light btn modal-trigger place-container" href="#modal1${place.place_id}" style="background: url(${photo}) no-repeat center; background-size: 100% 150px"></a> -->
			<!-- <div class="middle">
				<a class="place-name modal-trigger" href="#modal1${place.place_id}">${place.name}</a>
			</div> -->
		</div>
	</div>
  <div id="modal1${place.place_id}" class="modal modal${place.place_id}">
		<div class="modal-content">
			<div id="modal-map-${place.place_id}" style="width: 100%; height: 150px"></div>
			<div class="place-info">
				<h4>${place.name}</h4>
				<p>Clasificación: ${rating}</p>
				<p>Estado: ${status}</p>
				<p>Dirección: ${direction}</p>
			</div>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Aceptar</a>
    </div>
  </div>
          
	`;
	placesList.appendChild(placeContainer);

	$(document).ready(function () {
		$('.modal' + place.place_id).modal();
	});

	modalMap = document.getElementById('modal-map-' + place.place_id);

	var myLatLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

	var map = new google.maps.Map(modalMap, {
		zoom: 17,
		center: myLatLng
	});

	var marker = new google.maps.Marker({
		position: myLatLng,
		icon: 'img/location1.png',
		map: map,
		animation: google.maps.Animation.BOUNCE,
		title: place.name
	});
}

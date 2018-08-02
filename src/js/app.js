let map;
let infowindow;
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
			mapTypeId: google.maps.MapTypeId.MAP
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
		console.log(results.length)
		for (let i = 0; i < results.length; i++) {
			createMarker(results[i]);
			paintPlaces(results[i]);
			console.log(results[i])
		}
		let places = results;
		searchPlaces.addEventListener('keyup', () => {
			search = searchPlaces.value;

			function checkAdult(places) {
				return places.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
			}
			let placesSearched = places.filter(checkAdult);
			placesList.innerHTML = '';
			var div = document.querySelector('.gmnoprint');
			while (div.hasChildNodes()){
				div.removeChild(div.lastChild);
		}
			for (let i = 0; i < placesSearched.length; i++) {
				createMarker(placesSearched[i]);
				paintPlaces(placesSearched[i]);
			}
		})
	}
}

function createMarker(place) {
	let marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: 'img/location1.png',
		title: place.name,
	});
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

const paintPlaces = (place) => {
	console.log(place)
	let photo, rating, status, direction;
	let photos = place.photos;
	if (!photos) {
		return photos = 'img/suspicious.png';
	}

	if (place.hasOwnProperty('photos')) {
		photo = photos[0].getUrl({
			'maxWidth': 300,
			'maxHeight': 300
		});
		// p1.innerHTML = place.photos[0].html_attributions[0];
	} else {
		photo = 'img/suspicious.png';
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

	placeContainer.innerHTML = `
	<div class="col s4 container-photo">
		<img src="${photo}" alt="${place.name}" class="card photo" style="width:100%" >	
		<!-- <a class="card waves-effect waves-light btn modal-trigger place-container" href="#modal1${place.place_id}" style="background: url(${photo}) no-repeat center; background-size: 100% 150px"></a> -->
		<div class="middle">
			<a class="place-name modal-trigger" href="#modal1${place.place_id}">${place.name}</a>
		</div>
	</div>
  <div id="modal1${place.place_id}" class="modal modal${place.place_id}">
    <div class="modal-content">
      <h4>${place.name}</h4>
      <p>Clasificación: ${rating}</p>
      <p>Estado: ${status}</p>
      <p>Dirección: ${direction}</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
    </div>
  </div>
          
	`;
	placesList.appendChild(placeContainer);
	$(document).ready(function () {
		$('.modal' + place.place_id).modal();
	});
}
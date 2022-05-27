var myNum = '4d1d3a785c5d9d29d73debb3f37fbb0c';
var form = document.getElementById('search');
var currentConditionsHeaderEl = document.querySelector('#current-conditions h3');
var currentIconEl = document.querySelector('#current-icon');
var currentTempEl = document.getElementById('current-temp');
var currentWindEl = document.getElementById('current-wind');
var currentHumidityEl = document.getElementById('current-humidity');
var currentUvEl = document.getElementById('current-uv-index');
var fiveDayForecastEl = document.getElementById('five-day-forecast');
var searchListEl = document.querySelector('.search-list');
var theCity = '';
var searchHistory = [];
var weatherConditions = {};

var handleNewSearch = function (e) {
	e.preventDefault();

	searchHistory.push(e.target[0].value);
	displaySearchHistory();
	localStorage.setItem('storedSearchHistory', JSON.stringify(searchHistory));

	fetchData(e.target[0].value);

	e.target[0].value = '';
};

var handlePreviousSearch = function (e) {
	fetchData(e.target.textContent);
};

var fetchData = function (cityName) {
	var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${myNum}`;
	fetch(locationUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (city) {
			theCity = city[0].name;
			var cityLattitude = city[0].lat;
			var cityLongitude = city[0].lon;
			fetch(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLattitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${myNum}`
			)
				.then(function (weatherConditionsResponse) {
					return weatherConditionsResponse.json();
				})
				.then(function (weatherConditions) {
					displayFetchedContent(weatherConditions);
				});
		})
		.catch(function () {
			console.log('Could not find a city by that name.');
		});
};

var displayFetchedContent = function (fetchedWeatherConditions) {
	currentConditionsHeaderEl.textContent = theCity + moment().format(' (M / D / YYYY) ');
	setCurrentConditionsDisplay(fetchedWeatherConditions);
	buildFiveDayForecast(fetchedWeatherConditions);
};

var setCurrentConditionsDisplay = function (weatherConditions) {
	currentIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherConditions.current.weather[0].icon + '.png');
	currentTempEl.textContent = weatherConditions.current.temp;
	currentWindEl.textContent = weatherConditions.current.wind_speed;
	currentHumidityEl.textContent = weatherConditions.current.humidity;
	// TODO Color code UV index
	currentUvEl.textContent = weatherConditions.current.uvi;
};

var buildFiveDayForecast = function (weatherConditions) {
	fiveDayForecastEl.innerHTML = "<div class='cards row'></div>";
	for (i = 1; i < 6; i++) {
		createDailyCard(i, weatherConditions);
	}
};

var createDailyCard = function (cardIndex, weatherConditions) {
	var newCard = document.createElement('div');
	newCard.classList = 'card col-12 col-lg-5 col-xl small m-2 p-2';

	var cardTitle = document.createElement('div');
	cardTitle.setAttribute('class', 'card-title');
	cardTitle.textContent = moment().add(cardIndex, 'days').format(' (M / D / YYYY) ');

	var cardIcon = document.createElement('img');
	cardIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherConditions.daily[cardIndex].weather[0].icon + '.png');
	cardIcon.setAttribute('style', 'max-width: 4rem;');

	var cardTemp = document.createElement('p');
	cardTemp.textContent = 'Temp: ' + weatherConditions.daily[cardIndex].temp.day + ' °F';

	var cardWindSpeed = document.createElement('p');
	cardWindSpeed.textContent = 'Wind: ' + weatherConditions.daily[cardIndex].wind_speed + ' mph';

	var cardHumidity = document.createElement('p');
	cardHumidity.textContent = 'Humidity: ' + weatherConditions.daily[cardIndex].humidity + ' %';

	newCard.append(cardTitle, cardIcon, cardTemp, cardWindSpeed, cardHumidity);
	document.querySelector('#five-day-forecast .cards').appendChild(newCard);
};

var getSearchHistory = function () {
	if (localStorage.getItem('storedSearchHistory')) {
		var data = localStorage.getItem('storedSearchHistory');
		searchHistory = JSON.parse(data);
	}
};

var displaySearchHistory = function () {
	// Clear results from a previous search
	searchListEl.innerHTML = '';

	for (i = 0; i < searchHistory.length; ++i) {
		var searchItem = document.createElement('button');
		searchItem.classList = 'btn btn-secondary col-12 my-1';
		searchItem.textContent = searchHistory[i];

		searchListEl.appendChild(searchItem);
	}
};

getSearchHistory();
displaySearchHistory();

form.addEventListener('submit', handleNewSearch);
searchListEl.addEventListener('click', handlePreviousSearch);

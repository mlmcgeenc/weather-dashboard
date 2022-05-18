var apiKey = "2f28098e5b8068740488df8c6cfa93bb";
var conditionsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
var form = document.getElementById("search");

var fetchData = function (cityName) {
	var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
	fetch(locationUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (city) {
			console.log("City: ", city[0].name);
			document.querySelector("#current-conditions h3").textContent = city[0].name + moment().format(" (M / D / YYYY) ");

			var cityLattitude = city[0].lat;
			var cityLongitude = city[0].lon;
			fetch(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLattitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
			)
				.then(function (weatherConditionsResponse) {
					return weatherConditionsResponse.json();
				})
				.then(function (weatherConditions) {
					console.log(weatherConditions);
					setCurrentConditionsDisplay(weatherConditions);
				});
		})
		.catch(function () {
			console.log("Could not find a city by that name.");
		});
};

var setCurrentConditionsDisplay = function (weatherConditions) {
	document
		.querySelector("#current-icon")
		.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherConditions.current.weather[0].icon + ".png");
	document.getElementById("current-temp").textContent = weatherConditions.current.temp;
	document.getElementById("current-wind").textContent = weatherConditions.current.wind_speed;
	document.getElementById("current-humidity").textContent = weatherConditions.current.humidity;
	document.getElementById("current-uv-index").textContent = weatherConditions.current.uvi;
};

// TODO Finish building card and write loop to iterate over 5 day forecast, adding cards to #five-day-forecast
var createDailyCard = function(cardIndex) {
    var newCard = document.createElement('div')
    newCard.classList.add("card", "col-12", "col-lg-5", "col-xl", "small", "m-2", "p-2")

    var cardTitle = document.createElement('div')
    cardTitle.setAttribute("class", "card-title")
    cardTitle.textContent = "FUTURE DATE"

    var cardIcon = 
}

var handleSearch = function (e) {
	e.preventDefault();
	console.log(e.target[0].value);
	fetchData(e.target[0].value);
};

form.addEventListener("submit", handleSearch);

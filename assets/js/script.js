var myNum = "4d1d3a785c5d9d29d73debb3f37fbb0c";
var form = document.getElementById("search");
var weatherConditions = {};

var fetchData = function (cityName) {
	var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${myNum}`;
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
				`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLattitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${myNum}`
			)
				.then(function (weatherConditionsResponse) {
					return weatherConditionsResponse.json();
				})
				.then(function (weatherConditions) {
					console.log(weatherConditions);
					setCurrentConditionsDisplay(weatherConditions);
					buildFiveDayForecast(weatherConditions);
				});
		})
		.catch(function () {
			console.log("Could not find a city by that name.");
		});
};

var setCurrentConditionsDisplay = function (weatherConditions) {
	document
		.querySelector("#current-icon")
		.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherConditions.current.weather[0].icon + ".png");
	document.getElementById("current-temp").textContent = weatherConditions.current.temp;
	document.getElementById("current-wind").textContent = weatherConditions.current.wind_speed;
	document.getElementById("current-humidity").textContent = weatherConditions.current.humidity;
	// TODO Color code UV index
	document.getElementById("current-uv-index").textContent = weatherConditions.current.uvi;
};

var handleSearch = function (e) {
	e.preventDefault();
	fetchData(e.target[0].value);
	e.target[0].value = "";
};

var createDailyCard = function (cardIndex, weatherConditions) {
	var newCard = document.createElement("div");
	newCard.classList.add("card", "col-12", "col-lg-5", "col-xl", "small", "m-2", "p-2");

	var cardTitle = document.createElement("div");
	cardTitle.setAttribute("class", "card-title");
	cardTitle.textContent = moment().add(cardIndex, "days").format(" (M / D / YYYY) ");

	var cardIcon = document.createElement("img");
	cardIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherConditions.daily[cardIndex].weather[0].icon + ".png");
	cardIcon.setAttribute("style", "max-width: 4rem;");

	var cardTemp = document.createElement("p");
	cardTemp.textContent = "Temp: " + weatherConditions.daily[cardIndex].temp.day + " °F";

	var cardWindSpeed = document.createElement("p");
	cardWindSpeed.textContent = "Wind: " + weatherConditions.daily[cardIndex].wind_speed + " mph";

	var cardHumidity = document.createElement("p");
	cardHumidity.textContent = "Humidity: " + weatherConditions.daily[cardIndex].humidity + " %";

	newCard.append(cardTitle, cardIcon, cardTemp, cardWindSpeed, cardHumidity);
	document.getElementById("five-day-forecast").appendChild(newCard);
};

var buildFiveDayForecast = function (weatherConditions) {
	for (i = 1; i < 6; i++) {
		createDailyCard(i, weatherConditions);
	}
};

form.addEventListener("submit", handleSearch);

// Displaying Current Date

function currentDate() {
  let now = new Date();
  let date = now.getDate();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[now.getMonth()];

  let year = now.getFullYear();

  let newDate = document.querySelector(".date");
  newDate.innerHTML = `${day}, ${date} ${month} ${year}`;
}
currentDate();

// Displaying Current Time

function currentTime() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  minute = minute < 10 ? "0" + minute : minute;
  let newTime = document.querySelector(".time");
  newTime.innerHTML = `${hour}:${minute} ${ampm}`;
}
currentTime();

// If The User Allow the Browser to Access the Location

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function getWeatherData(lat, lon) {
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      displayWeather(data);
    });
}

// If The User Use the Search Bar

let searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let city = searchInput.value;
    searchCity(city);
  }
});

function searchCity(city) {
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    });
}

function displayWeather(data) {
  let city = data.city;
  let country = data.country;
  let temp = Math.round(data.temperature.current);
  let description = data.condition.description;
  let iconUrl = data.condition.icon_url;

  let location = document.querySelector(".location");
  location.innerHTML = `${city}, ${country}`;

  let weatherTemp = document.querySelector("#temp-display");
  weatherTemp.innerHTML = `${temp}??`;

  let weatherType = document.querySelector(".weather-type");
  weatherType.innerHTML = `${description}`;

  let weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.innerHTML = `<img src="${iconUrl}" alt="weather icon">`;
}

// 5 Day Forecast 

function getForecastData(lat, lon, apiKey) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayForecast(data.daily);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // clear previous content

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 5; i++) {
    const day = forecastData[i];

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("day");

    const date = new Date(day.time * 1000); // convert UNIX timestamp to JS date
    const dayOfWeek = daysOfWeek[date.getDay()]; // get day of week abbreviation

    const iconUrl = day.condition.icon_url;
    const description = day.condition.description;

    const minTemp = Math.round(day.temperature.minimum);
    const maxTemp = Math.round(day.temperature.maximum);

    const forecastContent = `
      <h6 class="day-name">${dayOfWeek}</h6>
      <img src="${iconUrl}">
      <h6 class="day-weather">${description}</h6>
      <h6 class="day-temp">${minTemp}?? / <strong>${maxTemp}??</stronng></h6>
      `;

    forecastCard.innerHTML = forecastContent;
    forecastContainer.appendChild(forecastCard);
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  getWeatherData(lat, lon);
  getForecastData(lat, lon, apiKey);
}

getLocation();

// Converting Temperature

function convertCelsiusToFahrenheit(temperature) {
  return ((temperature * 9) / 5 + 32).toFixed(0);
}

function convertFahrenheitToCelsius(temperature) {
  return (((temperature - 32) * 5) / 9).toFixed(0);
}

function toggleTempUnit(event) {
  event.preventDefault();

  let tempDisplay = document.querySelector("#temp-display");
  let tempUnit = document.querySelector(".temp-unit");

  let temperature = parseFloat(tempDisplay.textContent);
  let currentUnit = tempUnit.textContent.includes("Celsius")
    ? "Celsius"
    : "Fahrenheit";

  if (currentUnit === "Celsius") {
    // Convert to Fahrenheit
    tempDisplay.textContent = `${convertCelsiusToFahrenheit(temperature)}??`;
    tempUnit.innerHTML =
      'Fahrenheit <a href="#" class="temp-toggle">| Convert to Celsius</a>';
  } else {
    // Convert to Celsius
    tempDisplay.textContent = `${convertFahrenheitToCelsius(temperature)}??`;
    tempUnit.innerHTML =
      'Celsius <a href="#" class="temp-toggle">| Convert to Fahrenheit</a>';
  }
}

document
  .querySelector(".temp-toggle")
  .addEventListener("click", toggleTempUnit);



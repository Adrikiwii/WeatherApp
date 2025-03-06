var temp = "";
var is_day = "";
let jsonFile;

fetch("./meteo.json")
  .then((response) => response.json())
  .then((json) => {
    jsonFile = json;
  });

GetLocation();
function GetLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(SetWeather);
  }
}

function SetWeather(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);
  fetch(
    "https://geocode.xyz/" + latitude + "," + longitude + "?geoit=json"
  ).then((response) => {
    response.json().then((json) => {
      console.log(json);
      document.getElementById("city").innerHTML = json.city;
    });
  });
  fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&current=temperature_2m,is_day,weather_code&hourly=temperature_2m,weather_code&forecast_days=1&models=best_match"
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      GetWeather(
        json.current.temperature_2m,
        json.current.is_day,
        json.current.weather_code
      );
      GetHourlyWeather(json.hourly);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("meteo").style.visibility = "visible";
    });
}

function SearchWeather(lat, long, city) {
  console.log(lat);
  console.log(long);
  document.getElementById("city").innerHTML = city;
  fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" +
      lat +
      "&longitude=" +
      long +
      "&current=temperature_2m,is_day,weather_code&hourly=temperature_2m,weather_code&forecast_days=1&models=best_match"
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      GetWeather(
        json.current.temperature_2m,
        json.current.is_day,
        json.current.weather_code
      );
      GetHourlyWeather(json.hourly);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("meteo").style.visibility = "visible";
    });
}
function GetWeather(temp, is_day, weather_code) {
  document.getElementById("temperature").innerHTML = temp + "°C";
  console.log(jsonFile[weather_code]);
  if (is_day == 0) {
    is_day = "night";
  } else {
    is_day = "day";
  }
  document.getElementById("weather").innerHTML =
    jsonFile[weather_code][is_day].description;
  document.getElementById("weather_img").src =
    jsonFile[weather_code][is_day].image;
  document.getElementById("meteo").className =
    "meteo container grid " + jsonFile[weather_code][is_day].className;
}

function GetHourlyWeather(data) {
  var div = document.getElementById("HourlyWeather");
  div.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    var hourly = document.createElement("div");
    var weather_code = data.weather_code[i];
    hourly.className = "hourly fs-10 p-2";
    var heure = data.time[i].slice(11, 16);
    hourly.innerHTML = "<p>" + heure + "</p>";
    hourly.innerHTML += "<img id='HourlyImg" + i + "' src='' alt='weather'>";
    hourly.innerHTML += "<p> " + data.temperature_2m[i] + "°C</p>";
    div.appendChild(hourly);
    heure = Math.floor(heure.slice(0, 2));
    if (heure < 6 || heure > 20) {
      is_day = "night";
    } else {
      is_day = "day";
    }
    document.getElementById("HourlyImg" + i).src =
      jsonFile[weather_code][is_day].image;
    hourly.className += " " + jsonFile[weather_code][is_day].className;
  }
}

function SearchCity() {
  let city = document.getElementById("cityInput").value;
  document.getElementById("cityInput").value = "";
  fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
      city +
      "&count=1&language=fr&format=json"
  ).then((response) => {
    response.json().then((json) => {
      console.log(json);
      SearchWeather(json.results[0].latitude, json.results[0].longitude, city);
    });
  });
}

document.getElementById("search").addEventListener("click", SearchCity);


var cityList = [];
var id = "3f84d05d915a3bdf1a669df182c82016";

//stores cityList in LocalStorage

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cityList));

}

//add last searched city to the list-group as button for user to select city

function createCityList() {
    $(".cityList").empty();
    cityList.forEach(function(city) {
        $(".cityList").prepend($(`<button class="list-group-item list-group-item-action cityButton" data-city="${city}">${city}</button>`));
    })
}

//loads cityList from local storage and calls api to get the data for the last searched city if it exists

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !==null) {
        cityList = storedCities;
    }
    createCityList();

    if (cityList) {
        var thisCity = cityList[cityList.length - 1]
        getCurrentWeather(thisCity, id);
        getForecast(thisCity, id);
    }
}

// gets current forecast for selected city and calls uv index function
function getCurrentWeather(thisCity, id) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=${thisCity}&units=imperial&appid=${id}";
    var cityLat;
    var cityLong;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(data){
        $(".cityToday").append(
            `<div class="row ml-1">
                <h3 class="mr-3">${data.name} (${(new Date(1000 * data.dt).getUTCMonth()) + 1}/${(new Date(1000 * data.dt).getUTCDate()) - 1}/${new Date(1000 * data.dt).getUTCFullYear()})</h3>
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </div>`
            
        )
        //append new divs with weather information
        $(".cityToday").append('<p>Temperature: ${data.main.temp} &degf</p>')
        $(".cityToday").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityToday").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(id, cityLat, cityLong);
    })
    

}

//get 5 day forecast for the selected City
function getForecast(thisCity, id) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=${thisCity}&units=imperial&appid=${id}";
}


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

    //using ajax to pull forecast information from forecast URL
    $.ajax({
        url: forecastURL,
        method:"GET"
    }).then(function (data){
        for (i =0; i <data.list.length; i++) {
            if data.list[i].dt_txt.search("15:00:00") != -1) {
                var forcastDate = data.list[i];
                //append the forecast to the list
                $("forecast").append(
                    `<div class="card bg-primary shadow m-4">
                    <div class="card-body">
                        <h4 class="card-title">${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${new Date(1000 * forecastDate.dt).getUTCDate()}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h4>
                        <div class="card-text">
                            <img src="http://openweathermap.org/img/w/${forecastDate.weather[0].icon}.png">
                            <p class="card-text">Temp: ${forecastDate.main.temp} &degF</p>
                            <p class="card-text">Humidity: ${forecastDate.main.humidity} %</p>
                        </div>
                    </div>
                </div>`
                );
            }
        }
    })
}

// called getCurrentWeather function to get uv index for the selected city

function getCurrentWeather(thisCity, id) {
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${thisCity}&units=imperial&appid=${id}`;
    var cityLat;
    var cityLong;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (data) {
        $(".cityToday").append(
            `<div class="row ml-1">
                <h3 class="mr-3">${data.name} (${(new Date(1000 * data.dt).getUTCMonth()) + 1}/${(new Date(1000 * data.dt).getUTCDate()) - 1}/${new Date(1000 * data.dt).getUTCFullYear()})</h3>
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </div>`
        )
        $(".cityToday").append(`<p>Temperature: ${data.main.temp} &degF</p>`)
        $(".cityToday").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityToday").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(id, cityLat, cityLong);
    })

}
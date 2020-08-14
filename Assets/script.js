
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


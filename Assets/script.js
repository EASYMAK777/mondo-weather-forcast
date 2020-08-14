
$(document).ready(function() {

    var citySearch = "";
    // APIKey
    var APIKey = "3454e50c3bf841b68c9335f9ed3061d2";  

    initDoc();

    //***** CLICKING EVENTS *****/
    //if the search button is clicked, then search.
    $("#search-btn").on("click", function() {
        if (saveCityList()) {
            retrieveWeather(true);
        };

    });

    $(document).keyup(function (e) {
        if (e.keyCode == 13) {
            $("#search-btn").click();
        }
    });
    
    
    $(document).on("click","td", function(e){
        citySearch = e.target.innerHTML;
        saveLastCitySearched(citySearch);
        retrieveWeather(false);
    });
    //*****END CLICKING EVENTS *****/
    
    function retrieveWeather(needCity){
        if (needCity) {
            getcitySearch()
        }
        //AJAX and building cards.  Since asyncrhonous, I dont care which one loads first and second.
        buildTodaysWeather();
        buildFiveDayForecast();
    };
    
    //This function builds todays weather - the big section on the right
    //The function is expecting two things - the response object and the uv data
    //retrieved from the five day forecast API call.
    function buildTodaysWeather () {
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch +"&appid=" + APIKey;
    
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
          }).then(function(todaysWeather) {
    
  //clear the 'todays-weather' div for new data
  $("#todays-weather").empty();
  //create a new card body
  var newDiv = $("<div>").addClass("card-body");
  //city name
  var newH4 = $("<h4>",{class: "card-title", text: citySearch + " (Current) "});  //works with a variable for text
  //get the icon and appened to the h4
  var icon =todaysWeather.weather[0].icon;
  var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
  var newI = $("<img>").attr("src", iconURL);            
  newH4.append(newI);
  
 //temp, converted from kelvin
 var tempFromKelvin = (todaysWeather.main.temp - 273.15) * 1.80 + 32
 var newP1 = $("<p>",{class: "card-text", text: "Temperature: " + tempFromKelvin.toFixed(1) + " °F"}); //  alt 0 1 7 6
 //humidity
 var newP2 = $("<p>",{class: "card-text", text: "Humidity: " + todaysWeather.main.humidity +"%"});
 //wind speed
 var newP3 = $("<p>",{class: "card-text", text: "Wind Speed: " + todaysWeather.wind.speed + " MPH"});                
 //uv index
 var newP4 = $("<p>",{class: "card-text", text: "UV Index: "});
 
 
 //api for that using the location coordinates.  Get those from the current weather api and pass them to the uv api.  
 //build the elements
 var latValue = todaysWeather.coord.lat;
 var lonValue = todaysWeather.coord.lon;

 var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;

 
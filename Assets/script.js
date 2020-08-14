
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
 
 
 //api using the location coordinates to get uv rating  
 //build the elements
 var latValue = todaysWeather.coord.lat;
 var lonValue = todaysWeather.coord.lon;

 var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;

 $.ajax({
    url: uvURL,
    method: "GET"
}).then(function(uvWeather) {
    
    var uvValue = uvWeather.value;
    
    //get the uv colors based on the uv index
    var uvColor = "";
    if (uvValue < 3){
        uvColor = "lowuv"
    }
    else if (uvValue < 6){
        uvColor = "mediumuv"                    
    }
    else if (uvValue < 8){
        uvColor = "highuv"                    
    }                
    else if (uvValue < 11){
        uvColor = "veryhighuv"                    
    }                  
    else {
        uvColor = "extremelyhighuv"                    
    };

    var newSpan = $("<span>",{class: uvColor, text: uvValue});                        
    newP4.append(newSpan);
    newDiv.append(newH4, newP1, newP2, newP3, newP4);
    $("#todays-weather").append(newDiv);
});
});


}

//this function builds the five day forecast
//function expects the five day forecast object
function buildFiveDayForecast () {

var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + APIKey;

//build cards to get the 5-day forecast
$.ajax({
    url: fiveDayURL,
    method: "GET"
    }).then(function(fiveDaysWeather) {
    console.log(fiveDaysWeather);
    $("#fivedaywords").empty();
    $("#fivedaysection").empty();        
    
    $("#fivedaywords").text("5-Day Forecast");
    
    //Gets the information from the API
    var element3PMFirstAppears = 0;
    for (i = 0; i < 8; i++) {
        if (fiveDaysWeather.list[i].dt_txt.includes("15:00:00")) {
            element3PMFirstAppears = i;
            break;
        }
    }
    
    //Get the 3pm element every day for the next 5 day
    //api helps get weather for 3pm that day,
    for (i = element3PMFirstAppears; i < 40; i+=8) {
        var sectionNbr = "#section" + i;
        var newSection = $("<section>",{class: "col-lg-2", id: sectionNbr});           
        var newCard = $("<div>").addClass("card bg-primary text-white");            
        var newDiv = $("<div>").addClass("card-body");
        var newH5 = $("<h5>",{class: "card-title", text: moment(fiveDaysWeather.list[i].dt_txt).format('MM/DD/YYYY')});
        
       
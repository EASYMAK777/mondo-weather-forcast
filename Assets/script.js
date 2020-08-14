$(document).ready(function() {

    var inputCity = "";
    // APIKey
    var APIKey = "3f84d05d915a3bdf1a669df182c82016";  

    initDoc();

    //***** CLICKING EVENTS *****/
    //if the search button is clicked, then search.
    $("#search-btn").on("click", function() {
            if (saveCityList()) {
                retrieveWeather(true);
            };

    });
    

    
    $(document).on("click","td", function(e){
        inputCity = e.target.innerHTML;
        saveLastCitySearched(inputCity);
        retrieveWeather(false);
    });
    //*****END CLICKING EVENTS *****/


    //this function is used to retrieve the weather.  
    function retrieveWeather(needCity){
        if (needCity) {
            getInputCity()
        }
        //Setting up ajax for cards
        buildTodaysWeather();
        buildFiveDayForecast();
    };

    // function that will build weather cards
    function buildTodaysWeather () {
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity +"&appid=" + APIKey;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
          }).then(function(todaysWeather) {

            //clear the 'todays-weather' div for new data
            $("#todays-weather").empty();
            //create a new card body
            var newDiv = $("<div>").addClass("card-body");
            //city name
            var newH4 = $("<h4>",{class: "card-title", text: inputCity + " (Current) "});  //works with a variable for text
            //get the icon and appened to the h4
            var icon =todaysWeather.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            var newI = $("<img>").attr("src", iconURL);            
            newH4.append(newI);
            
            //temp, converted from kelvin
            var tempFromKelvin = (todaysWeather.main.temp - 273.15) * 1.80 + 32
            var newP1 = $("<p>",{class: "card-text", text: "Temperature: " + tempFromKelvin.toFixed(1) + " °F"}); 
            //humidity
            var newP2 = $("<p>",{class: "card-text", text: "Humidity: " + todaysWeather.main.humidity +"%"});
            //wind speed
            var newP3 = $("<p>",{class: "card-text", text: "Wind Speed: " + todaysWeather.wind.speed + " MPH"});                
            //uv index
            var newP4 = $("<p>",{class: "card-text", text: "UV Index: "});
            
            // got uv index from another api
            var latValue = todaysWeather.coord.lat;
            var lonValue = todaysWeather.coord.lon;

            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;
                //using ajax to get uv index from a new api
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(uvWeather) {
                
                var ultraVioletIndex = uvWeather.value;
                
                //get the uv index
                var ultraVioletColor = "";
                if (ultraVioletIndex < 3){
                    ultraVioletColor = "lowuv"
                }
                else if (ultraVioletIndex < 6){
                    ultraVioletColor = "mediumuv"                    
                }
                else if (ultraVioletIndex < 8){
                    ultraVioletColor = "highuv"                    
                }                
                else if (ultraVioletIndex < 11){
                    ultraVioletColor = "veryhighuv"                    
                }                  
                else {
                    ultraVioletColor = "extremelyhighuv"                    
                };

                var newSpan = $("<span>",{class: ultraVioletColor, text: ultraVioletIndex});                        
                newP4.append(newSpan);
                newDiv.append(newH4, newP1, newP2, newP3, newP4);
                $("#todays-weather").append(newDiv);
            });
        });


    }

    //this function builds the five day forecast
    //function expects the five day forecast object
    function buildFiveDayForecast () {

        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=" + APIKey;
        

        //get the 5 day forecast, and build 5 different cards
        $.ajax({
            url: fiveDayURL,
            method: "GET"
          }).then(function(fiveDaysWeather) {
            console.log(fiveDaysWeather);
            $("#fivedaywords").empty();
            $("#fivedaysection").empty();        
    
            $("#fivedaywords").text("5-Day Forecast");

            
            var element3PMFirstAppears = 0;
            for (i = 0; i < 8; i++) {
                if (fiveDaysWeather.list[i].dt_txt.includes("15:00:00")) {
                    element3PMFirstAppears = i;
                    break;
                }
            }
    
            //Get the 3pm element every day for the next 5 days
            for (i = element3PMFirstAppears; i < 40; i+=8) {
                var sectionNbr = "#section" + i;
                var newSection = $("<section>",{class: "col-lg-2", id: sectionNbr});           
                var newCard = $("<div>").addClass("card bg-primary text-white");            
                var newDiv = $("<div>").addClass("card-body");
                var newH5 = $("<h5>",{class: "card-title", text: moment(fiveDaysWeather.list[i].dt_txt).format('MM/DD/YYYY')});
                //Iclude weather icon to the card
                var icon =fiveDaysWeather.list[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/wn/" + icon + ".png"
                var newI = $("<img>").attr("src", iconURL);  
                //get temp 
                var tempFromKelvin = (fiveDaysWeather.list[i].main.temp - 273.15) * 1.80 + 32
                var newP1 = $("<p>",{class: "card-text", text: "Temp: " + tempFromKelvin.toFixed(1) + " °F"}); //  alt 0 1 7 6
                
                newDiv.append(newH5, newI, newP1,);
                $(newCard).append(newDiv);
                $(newSection).append(newCard);
                $("#fivedaysection").append(newSection);
            }            

        });


    }

    //CODE FOR SAVING CITIES SEARCHED

    //initialize the document.  Retrieve any previous
    //cities searched for.  
    function initDoc() {
        retrievePreviouslySearchedList();
        inputCity = retrieveLastCitySearched();
        if (inputCity != null) {
            retrieveWeather(false);
        }
    };

    //get the city that the user input.  
    function getInputCity(){
        inputCity =  $("#search-input").val().trim();
        if (inputCity == "") {
            alert("Please enter a city to search for.")
            return false;
        }
        return true;
        
    }

    //save the last city searched
    function saveLastCitySearched(cityName){
        localStorage.setItem("lastCitySearched", cityName);
    };

    //get the last city searched
    function retrieveLastCitySearched(){
        return localStorage.getItem("lastCitySearched");
    };    

    //save each search as an array
    function saveCityList() {        

        if (getInputCity()) {
            var cities = JSON.parse(window.localStorage.getItem('citiesPreviouslySearched'));
            if (cities === null) {
                cities = [];
            }
            //keeps from saving repeated searches
            if (cities.indexOf(inputCity) == -1) {
                cities.push(inputCity);
                localStorage.setItem("citiesPreviouslySearched", JSON.stringify(cities));
                retrievePreviouslySearchedList();
            };         
            
            saveLastCitySearched(inputCity);
            return true;
        };        
        return false;

    }

    //Get all of the cities previously searched, and
    //add them to the table.
    function retrievePreviouslySearchedList(){
        $("tbody").empty();
        var cities = JSON.parse(window.localStorage.getItem('citiesPreviouslySearched'));
        if (cities != null) {
            for (i = 0; i < cities.length; i++) {
                var newTR = $("<tr>");
                var citySearched = $("<td>").text(cities[i]);
                newTR.append(citySearched)      
                $("tbody").append(newTR);                
            }
        } 
    }


});


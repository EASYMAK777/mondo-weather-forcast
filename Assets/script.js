
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


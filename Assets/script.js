
var cityList = [];
var id = "3f84d05d915a3bdf1a669df182c82016";

//stores cityList in LocalStorage

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cityList));

}


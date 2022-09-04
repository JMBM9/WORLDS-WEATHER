

moment().format('L');

//search city functiom
function searchCity(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=ecc0be5fd92206da3aa90cc41c13ca56";
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=ecc0be5fd92206da3aa90cc41c13ca56";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
     
        $("#current").empty();
       let mainDate = moment().format('L');
 //CITY DETAILS
      var cityNameEl = $("<h1>").text(response.name);
        var displayMainDate = cityNameEl.append(" " + mainDate);
        var tempEL = $("<h3>").text("Temperature: " + response.main.temp);
        var humEl = $("<h3>").text("Humidity: " + response.main.humidity);
        var windEl = $("<h3>").text("Wind Speed: " + response.wind.speed);
        let currentweather = response.weather[0].main;
//WEATHER CONDITIONALS
        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
    
        var newDiv = $('<div>');

        newDiv.append(displayMainDate, currentIcon, tempEL, humEl, windEl);

        $("#current").html(newDiv);
        
//response coordinates
let lat = response.coord.lat;
let lon = response.coord.lon;
let queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('#uvl-display').empty();
            var uvlresults = response.value;
            
            var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
            $('#uvl-display').html(uvlEl);
    
        });
    });


    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function (response) {
       //results
        var results = response.list;
     
        $("#5daystats").empty();
       //search loop
        for (var i = 0; i < results.length; i += 8) {
           
            var fivedaysstats = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
            
           
            var date = results[i].dt_txt;
            let setD = date.substr(0,10)
            let temp = results[i].main.temp;
            var hum = results[i].main.humidity;
   
          
            var daysDisplay = $("<h5 class='card-title'>").text(setD);
            let presentTemperature = $("<p class='card-text'>").text("Temperature: " + temp);;
            var presentHumidity = $("<p class='card-text'>").text("Humidity " + hum);;

            let weather = results[i].weather[0].main

            if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } 
             else if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

          
            fivedaysstats.append(daysDisplay);
            fivedaysstats.append(icon);
            fivedaysstats.append(presentTemperature);
            fivedaysstats.append(presentHumidity);
            $("#5daystats").append(fivedaysstats);
        }

    });



}
//load results page
pageLoad();

$("#select-city").on("click", function (event) {
  
    event.preventDefault();
 
    var cityInput = $("#city-input").val().trim();
     console.log('looking for city')
    var textContent = $(this).siblings("input").val();
    var storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));
  
    searchCity(cityInput);
    pageLoad();
});

//searchhistorypage
function pageLoad () {
    var lastSearch = JSON.parse(localStorage.getItem("cityName"));
    let searchbar = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    var pastsearch = $("<div>");
    pastsearch.append(searchbar)
    $("#searchhistory").prepend(pastsearch);
}


$("#searchhistory").on('click', '.btn', function(event) {
event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());
    console.log('checking the past.')

});

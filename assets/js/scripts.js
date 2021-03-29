const APIkey= "83119db3f424bf6748e85fb160b53a04";
let counter=localStorage.length;

//grabbing elements
const currentWeatherContainer= document.getElementById("currentWeather");
const forecastContainer= document.getElementById("forecast");
const searchButton= document.getElementById("searchButton");
const searchContent=document.getElementById("searchContent");
const searchBox=document.getElementById("searchBox");

//if there is anything in local storage populate searchbox with past queries
if(localStorage){
    for(i=0; i<localStorage.length; i++){
        let searchQuery= localStorage.getItem(localStorage.key(i));
        let searchRow=document.createElement("div");
        searchRow.setAttribute("class", "card row mt-2");
        searchRow.setAttribute("onclick", "findCurrentWeather("+JSON.stringify(searchQuery)+")");
        searchRow.innerHTML=searchQuery;
        searchBox.append(searchRow);
    }
}

//event listener for search button
searchButton.addEventListener("click", function(){
    let cityName=searchContent.value;
    console.log(searchContent.value);
    findCurrentWeather(cityName);
    
    //if query is already in localstorage exit otherwise populate searchbox with query. 
    for(i=0; i<localStorage.length; i++){
        if(cityName==localStorage.getItem(localStorage.key(i))){
            return
        }
    }
    localStorage.setItem(counter, cityName);
    counter++;
    let searchRow=document.createElement("div");
    searchRow.setAttribute("class", "card row mt-2");
    //adding onlick that will generate forecast when you click on previous search query;
    searchRow.setAttribute("onclick", "findCurrentWeather("+JSON.stringify(cityName)+")");
    searchRow.innerHTML=cityName;
    searchBox.append(searchRow);

});

//function to fetch 
let findCurrentWeather= function(cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIkey}`)
    .then(response => response.json())
    .then(function(data){
        makeCurrentWeatherCard(data);
    });
}

//function that makes the Current Weather Card
let makeCurrentWeatherCard= function(data){
    currentWeatherContainer.innerHTML="";
    forecastContainer.innerHTML="";

    //storing lat and lon for second api call
    let lat= data.coord.lat;
    let lon= data.coord.lon;

    //populating info
    let city= data.name;
    let date= new Date();
    let currentMonth= date.getMonth()+1
    let cityDate= city+" ("+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+")";
    let cityElement= document.createElement("h2");
    cityElement.innerHTML=cityDate;
    currentWeatherContainer.append(cityElement);

    let break1= document.createElement("br");
    currentWeatherContainer.append(break1);

    let weatherid= data.weather[0].icon;
    let weatherIcon= document.createElement("img");
    weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weatherid}@2x.png`);
    currentWeatherContainer.append(weatherIcon);

    let temp= data.main.temp;
    let tempElement= document.createElement("p");
    tempElement.innerHTML="Temperature: "+temp+ "°F";
    currentWeatherContainer.append(tempElement);

    let humidity= data.main.humidity;
    let humidityElement= document.createElement("p");
    humidityElement.innerHTML= "Humidity: "+humidity+"%";
    currentWeatherContainer.append(humidityElement);
    
    let windSpeed= data.wind.speed;
    let windSpeedElement= document.createElement("p");
    windSpeedElement.innerHTML= "Wind Speed: "+windSpeed+"%";
    currentWeatherContainer.append(windSpeedElement);

    //second api call with lat and lon of city to get 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`)
    .then(response => response.json())
    .then(function(data){

        //populating current day with UV index since this info was in second api call it changes color depending on the value
        let uv= data.current.uvi;
        let uvElement= document.createElement("p");
        uvElement.innerHTML="UV index: "+ uv;
        if (uv<3){
            uvElement.setAttribute("class", "bg-success text-white ")
        }
        else if(uv>10){
            uvElement.setAttribute("class", "bg-danger text-white")
        }
        else{
            uvElement.setAttribute("class", "bg-info text-white")
        }
        currentWeatherContainer.append(uvElement);

        forecastHeader= document.createElement("h2");
        forecastHeader.setAttribute("class", "mt-3");
        forecastHeader.innerHTML="5-day Forecast: ";
        forecastContainer.append(forecastHeader);

        let forCastRow= document.createElement("div");
        forCastRow.setAttribute("class", "row");
        forecastContainer.append(forCastRow);

        // making the 5 day forecast
        for(i=1; i<6; i++){
            let forCastCard= document.createElement("div");
            forCastCard.setAttribute("class", "card col-2 mr-3 bg-info");
            forCastRow.append(forCastCard);

            let forCastBody= document.createElement("div");
            forCastBody.setAttribute("class", "card-body text-white");
            forCastCard.append(forCastBody);

            let forecastDate=data.daily[i].dt;
            let d= new Date(0);
            d.setUTCSeconds(forecastDate);
            let formatForecastD= (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();
            let forDateElement=document.createElement("p");
            forDateElement.innerHTML=formatForecastD;
            forCastBody.append(forDateElement);

            let weatherForeCastid= data.daily[i].weather[0].icon;
            let weatherForCastIcon= document.createElement("img");
            weatherForCastIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weatherForeCastid}.png`);
            forCastBody.append(weatherForCastIcon);

            let forCastHumidity= data.daily[i].humidity;
            let forCastHumElement= document.createElement("p");
            forCastHumElement.innerHTML="Humidity: "+ forCastHumidity+"%";
            forCastBody.append(forCastHumElement);

            let forCastTemp= data.daily[i].temp.day;
            let forCastTempElement= document.createElement("p");
            forCastTempElement.innerHTML= "Temperature: "+forCastTemp+ "°F"
            forCastBody.append(forCastTempElement);

        }
    })
}


let cityname= "Austin";
const APIkey= "83119db3f424bf6748e85fb160b53a04";

const currentWeatherContainer= document.getElementById("currentWeather");

let findCurrentWeather= function(){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=imperial&appid=${APIkey}`)
    .then(response => response.json())
    .then(function(data){
        console.log(data);
        makeCurrentWeatherCard(data);
    });
}

let makeCurrentWeatherCard= function(data){
    let lat= data.coord.lat;
    let lon= data.coord.lon;

    let city= data.name;
    let date= new Date();
    let cityDate= city+" ("+date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear()+")";
    let cityElement= document.createElement("h2");
    cityElement.innerHTML=cityDate;
    currentWeatherContainer.append(cityElement);

    let break1= document.createElement("br");
    currentWeatherContainer.append(break1);

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

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    .then(response => response.json())
    .then(function(data){
        console.log(data);
        let uv= data.current.uvi;
        let uvElement1= document.createElement("span");
        uvElement1.innerHTML="UV index: ";
        currentWeatherContainer.append(uvElement1);
        let uvElement2= document.createElement("span");
        uvElement2.innerHTML=uv;
        currentWeatherContainer.append(uvElement2);
    })
}

findCurrentWeather();
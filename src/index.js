const API_KEY = process.env.API_KEY;

async function getWeather(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${API_KEY}&contentType=json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        console.log(data);
        
        return processWeatherData(data);
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function processWeatherData(data) {
    const temperatureF = data.currentConditions.temp;
    const temperatureC = fahrenheitToCelsius(temperatureF);
    const roundedTemperatureC = Math.ceil(temperatureC);

    const weatherInfo = {
        temperatureF: temperatureF,
        temperatureC: roundedTemperatureC,
        description: data.currentConditions.conditions,
        location: data.resolvedAddress,
    };
    
    console.log(weatherInfo);
    return weatherInfo;
}

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const location = document.getElementById('location').value;
    
    getWeather(location).then(weatherInfo => {
        if (weatherInfo) {
            displayWeather(weatherInfo);
        }
    });
});

function displayWeather(weatherInfo) {
    const weatherDiv = document.getElementById('weather-info');
    
    weatherDiv.innerHTML = `
        <h2>Погода в ${weatherInfo.location}</h2>
        <p>Температура: ${weatherInfo.temperatureF}°F (${weatherInfo.temperatureC}°C)</p>
        <p>Описание: ${weatherInfo.description}</p>
    `;
}
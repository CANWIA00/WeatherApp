import axios from 'axios';

export const apiKey = "3e42486335d84947aa403516252501";

const forecastEndpoint = (params) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationEndpoint = (params) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

export const Images = {
    'Partly cloudy': require('../assets/img/cloudy.png'),
    'Moderate rain': require('../assets/img/cloudyRain.png'),
    'Patchy rain possible': require('../assets/img/sunnRain.png'),
    'Sunny': require('../assets/img/sunny.png'),
    'Clear': require('../assets/img/sunny.png'),
    'Overcast': require('../assets/img/foggy.png'),
    'Light rain': require('../assets/img/sunnRain.png'),
    'Moderate rain at times': require('../assets/img/sunnRain.png'),
    'Heavy rain': require('../assets/img/cloudyRain.png'),
    'Heavy rain at times': require('../assets/img/cloudyRain.png'),
    'Moderate or heavy freezing rain': require('../assets/img/cloudyRain.png'),
    'Moderate or heavy rain shower': require('../assets/img/cloudyRain.png'),
    'Moderate or heavy rain with thunder': require('../assets/img/cloudyRain.png'),
    'other': require('../assets/img/cloudyRain.png'),
    'Snow': require('../assets/img/snowy.png'),
    'Mist': require('../assets/img/foggy.png'),
};

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('API Call Error:', error.message || error);
        return null;
    }
};

export const fetchWeatherData = (params) => {
    let forecastUrl;
    if (params.cityName) {

        forecastUrl = forecastEndpoint({ cityName: params.cityName, days: params.days });
    } else if (params.latitude && params.longitude) {

        forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.latitude},${params.longitude}&days=${params.days}&aqi=no&alerts=no`;
    }
    return apiCall(forecastUrl);
};

export const fetchLocations = (params) => {
    let locationUrl = locationEndpoint(params);
    return apiCall(locationUrl);
};

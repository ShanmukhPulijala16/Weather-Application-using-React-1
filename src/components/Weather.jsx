import React, { useEffect, useRef, useState } from 'react';
import '../styles/Weather.css'

// Background Card Icons
import searchIcon from '../assets/search.png';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';

// Weather Icons
import clearIcon from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';

// Function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getDateTimeFromTimestamp = (dateTime) => {
  // Extract the Unix timestamp from the JSON object
  const unixTimestamp = dateTime;
  // Convert the Unix timestamp to milliseconds by multiplying by 1000
  const date = new Date(unixTimestamp * 1000);

  // Format options for IST
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  // Convert to IST using toLocaleString
  const istDateTimeString = date.toLocaleString('en-IN', options);
  // Split into date and time components
  const [istDate, istTime] = istDateTimeString.split(', ');
  return { istDate, istTime };
}

const Weather = () => {

  // Reference to Input element 
  const inputRef = useRef();
  // Toggle mode state
  const [mode, setMode] = useState('light');
  // Weather data state
  const [weatherData, setWeatherData] = useState(false);

  // const [weatherData, setWeatherData] = useState({
  //   humidity: 0,
  //   windSpeed: 0,
  //   temperature: 0,
  //   location: 0,
  //   icon: clearIcon
  // });

  //Access all icons from here
  const allIcons = {
    "01d": clearIcon,
    "02d": cloudIcon,
    "03d": cloudIcon,
    "04d": drizzleIcon,
    "09d": rainIcon,
    "10d": rainIcon,
    "13d": snowIcon
  }

  const search = async (cityOrZipCode) => {
    if (cityOrZipCode === "") {
      alert("Please enter a city name!");
      return;
    }
    try {
      const API_KEY = "caebac1244b00be05986ff3b31e641f8";
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityOrZipCode}&units=metric&appid=${API_KEY}`;
      if (typeof cityOrZip === 'number') {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${cityOrZipCode}&units=metric&appid=${API_KEY}`;
      }
      const response = await fetch(url);
      console.log("response: ", response);
      const data = await response.json();
      console.log("weatherData: ", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }
      // if (data.cod === '404' && data.message === 'city not found') {
      //   alert('City not found. Please type exact name!');
      //   return;
      // }

      const icon = allIcons[data.weather[0].icon] || clearIcon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        description: capitalizeFirstLetter(data.weather[0].description),
        dateTime: getDateTimeFromTimestamp(data.dt)
      });
    } catch (error) {
      setWeatherData(false);
      alert("Error in fetching weather data");
      console.error("Error in fetching weather data");
    }
  };

  useEffect(() => {
    search("Hyderabad");
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={searchIcon} onClick={() => search(inputRef.current.value)} alt="" />
      </div>
      {weatherData ? <>
        <img className='weather-icon' src={weatherData.icon} alt="" />
        {/* <img className='weather-icon' src={weatherIcon} alt="" /> */}
        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>
        <div className="weather-data">
          <div className="col">
            <img src={humidityIcon} alt="" />
            <div>
              <p>{weatherData.humidity} %</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="col">
            <img src={windIcon} alt="" />
            <div>
              <p>{weatherData.windSpeed} km/h</p>
              <span>Wind</span>
            </div>
          </div>
        </div>
        <h1 className='desc'>{weatherData.description}</h1>
        <div className='date-time'>
          <h3>{weatherData.dateTime.istDate}</h3>
          <h3>{weatherData.dateTime.istTime}</h3>
        </div>
      </> : <></>}
    </div>
  )
};

export default Weather
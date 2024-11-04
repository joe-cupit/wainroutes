import "./WeatherPage.css";

import { Fragment, useEffect, useState } from "react";

const WeatherSymbolsFolder = require.context("../assets/images/weather")
const WeatherSymbols = Object.fromEntries(WeatherSymbolsFolder.keys().map(image => [image.substring(2), WeatherSymbolsFolder(image)]));


export function WeatherPage() {

  document.title = "Lake District Weather | wainroutes";

  const [weatherData, setWeatherData] = useState(null)
  useEffect(() => {
    const fetchWeatherData = async () => {
      const weather = await fetch("/data/weather.json");
      const weatherJson = await weather.json();
      setWeatherData(weatherJson);
    }

    fetchWeatherData().catch(console.error)
  }, [])


  return (
    <main className="weather-page">

      <section>
        <div className="flex-column">
          <div className="weather-header">
            <h1 className="title">Lake District Weather</h1>
            <p className="secondary-text">Last updated: {new Date(weatherData?.update_time).toUTCString()}</p>
          </div>

          {weatherData?.days?.map((day, index) => {
            switch (day.type) {
              // case "this-evening": return <EveningWeather key={index} weather={day} />
              case "current-day": return <CurrentDayWeather key={index} weather={day} />
              case "tomorrows-tab": return <TomorrowsWeather key={index} weather={day} />
              case "further-outlook": return <FutureWeather key={index} weather={day} />
              default: return <Fragment key={index}></Fragment>
            }
          })}
        </div>
      </section>

    </main>
  )
}


function CurrentDayWeather({ weather }) {

  return (
    <div className="flex-column weather-day highlighted-section">

      <div>
        <h2 className="heading">{DateTitle(weather.date)}</h2>
        <span className="suntime">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</span>
      </div>

      <p>{weather.weather}</p>

      <div>
        <h4>Chance of Cloud-Free Hill Top</h4>
        <p>{weather.cloud_free_top}</p>
      </div>

      <div>
        <h4>Visibility</h4>
        <p>{weather.visibility}</p>
      </div>

      {weather.meteorologist_view && !weather.meteorologist_view.startsWith("Nothing") &&
        <div className="meteorologist">
          <h4>Meteorologist's View</h4>
          <p>{weather.meteorologist_view}</p>
        </div>
      }

      {/* <div>
        <h4>Ground Conditions</h4>
        <p>{weather.ground_conditions}</p>
      </div> */}

      <div className="forecast">
        <h4>Lake District Forecast at 800m</h4>
        <ForecastTable forecast={weather.forecast} />
      </div>

    </div>
  )
}


function ForecastRow({ title, data, postText, className }) {
  return (
    <tr className={className}>
      <th>{title}</th>
      {data.map((entry, index) => <td key={index}>{entry}{postText}</td>)}
    </tr>
  )
}

function TypeRow({ title, data }) {

  return (
    <tr>
      <th>{title}</th>
      {data.map((entry, index) => {
        const slug = entry.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "");
        return (
          <td key={index}>
            <img src={WeatherSymbols[`${slug}.svg`]} alt={entry} title={entry} />
          </td>
        )
      })}
    </tr>
  )
}

function ForecastTable({ forecast }) {
  return (
    <table className="forecast-table">
      <thead>
        <tr>
          <th></th>
          {forecast.time.map((time, index) => <th key={index}>{time}</th>)}
        </tr>
      </thead>
      <tbody>
        <TypeRow title="Weather" data={forecast.type} className={"primary-row"} />
        <ForecastRow title="Precipitation" data={forecast.precip} />
        {/* <tr className="table-break">
          <th colSpan="5">Temperature (°C)</th>
        </tr> */}
        <ForecastRow title="Temperature (°C)" data={forecast.temp} postText={"°"} className={"primary-row"} />
        <ForecastRow title="Feels-like" data={forecast.feel_temp} postText={"°"} className={"secondary-row"} />
        {/* <tr className="table-break">
          <th colSpan="5">Wind speeds (mph)</th>
        </tr> */}
        <ForecastRow title="Wind speed (mph)" data={forecast.wind_speed} className={"primary-row"} />
        <ForecastRow title="Wind gusts" data={forecast.wind_gust} className={"secondary-row"} />
        <ForecastRow title="Wind direction" data={forecast.wind_dir} />
      </tbody>
    </table>
  )
}


function TomorrowsWeather({ weather }) {
  return (
    <div className="flex-column weather-day">
      <div>
        <h2 className="heading">{DateTitle(weather.date)}</h2>
        <span className="suntime">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</span>
      </div>

      <p>{weather.weather}</p>

      <div>
        <h4>Chance of Cloud-Free Hill Top</h4>
        <p>{weather.cloud_free_top}</p>
      </div>

      <div>
        <h4>Visibility</h4>
        <p>{weather.visibility}</p>
      </div>

      <div>
        <h4>Wind</h4>
        <p>{weather.max_wind}</p>
      </div>

      <div>
        <h4>Temperature</h4>
        <ul>
          {Object.keys(weather.temperature).map((loc, index) => {
            return (
              <li key={index}>{loc}: {weather.temperature[loc]}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function FutureWeather({ weather }) {
  const weekdayDict = {
    "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" 
  }
  const monthDict = {
    "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June", "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October","Nov": "November", "Dec": "December"
  }

  return (
    <div className="weather-future">
      {weather.days?.map((day, index) => {
        var dateList = day.date.split(" ");
        dateList[0] = weekdayDict[dateList[0]];
        dateList[2] = monthDict[dateList[2]];
  
        return (
          <div key={index} className="flex-column weather-day">
            <div>
              <h3 className="subheading">{dateList.join(" ")}</h3>
              <span className="suntime">Sunrise: {day.sunrise}, Sunset: {day.sunset}</span>
            </div>
            <p>{day.summary}</p>
          </div>
        )
      })}
    </div>
  )
}


function DateTitle(dateString) {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  var date = new Date(dateString);

  return [weekday[date.getDay()], date.getDate(), month[date.getMonth()]].join(" ");
}

import "./WeatherPage.css";

import { Fragment } from "react";

import weatherData from "../assets/weather.json"
const WeatherSymbolsFolder = require.context("../assets/images/weather")
const WeatherSymbols = Object.fromEntries(WeatherSymbolsFolder.keys().map(image => [image.substring(2), WeatherSymbolsFolder(image)]));


export function WeatherPage() {

  document.title = "Lake District Weather | wainroutes";


  return (
    <main className="weather-page">

      <section>
        <div className="flex-column weather-main">
          <div className="weather-header">
            <h1 className="title">Lake District Weather</h1>
            <p className="secondary-text">{`Updated at: ${weatherData?.update_time}`}</p>
          </div>

          <div className="flex-column weather-days">
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
        </div>
      </section>

    </main>
  )
}


function CurrentDayWeather({ weather }) {

  return (
    <div className="flex-column">
      <div>
        <span className="secondary-text">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</span>
        <h2 className="heading">{DateTitle(weather.date)}</h2>
      </div>

      <div className="flex-row">
        <div className="flex-column weather-day">
          <p>{weather.weather}</p>

          <div className="forecast">
            <h3>Mountain Weather Forecast (800m)</h3>
            <ForecastTable forecast={weather.forecast} />
          </div>

          <div>
            <h3>Chance of Cloud-Free Hill Top</h3>
            <p>{weather.cloud_free_top}</p>
          </div>

          <div>
            <h3>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>

          <div>
            <h3>Summary</h3>
            <p>{weather.summary}</p>
          </div>
        </div>

        <div className="flex-column weather-extra-details">
          <div className="flex-column mountain-hazards">
            <h3>Mountain Hazards</h3>

            {weather.hazards
              ? <div className="flex-column mountain-hazards-list">
                  {weather.hazards.high &&
                    <div>
                      <h4>High likelihood</h4>
                      {Object.keys(weather.hazards.high).map((hazard, index) => {
                        return <p key={index} className="mountain-hazard high">{hazard}</p>
                      })}
                    </div>
                  }
                  {weather.hazards.medium &&
                    <div>
                      <h4>Medium likelihood</h4>
                      {Object.keys(weather.hazards.medium).map((hazard, index) => {
                        return <p key={index} className="mountain-hazard medium">{hazard}</p>
                      })}
                    </div>
                  }
                  {weather.hazards.low &&
                    <div>
                      <h4>Low likelihood</h4>
                      {Object.keys(weather.hazards.low).map((hazard, index) => {
                        return <p key={index} className="mountain-hazard low">{hazard}</p>
                      })}
                    </div>
                  }
                </div>
              : "None reported"}
          </div>

          <div>
            <h3>Meteorologist's View</h3>
            {weather.meteorologist_view && !weather.meteorologist_view.startsWith("Nothing")
              ? <p className="meteorologist">{weather.meteorologist_view}</p>
              : <p>{weather.meteorologist_view ?? "Nothing to add"}</p>
            }
          </div>
        </div>

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
        <TypeRow title="Weather type" data={forecast.type} className={"primary-row"} />
        <ForecastRow title="Precipitation %" data={forecast.precip} />

        <ForecastRow title="Temperature (°C)" data={forecast.temp} postText={"°"} className={"primary-row"} />
        <ForecastRow title="Feels-like" data={forecast.feel_temp} postText={"°"} className={"secondary-row"} />

        <ForecastRow title="Wind speed (mph)" data={forecast.wind_speed} className={"primary-row"} />
        <ForecastRow title="Wind gusts" data={forecast.wind_gust} className={"secondary-row"} />
      </tbody>
    </table>
  )
}


function TomorrowsWeather({ weather }) {
  return (
    <div className="flex-column weather-day">
      <div>
        <span className="secondary-text">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</span>
        <h2 className="heading">{DateTitle(weather.date)}</h2>
      </div>

      <p>{weather.summary}</p>

      <div>
        <h3>Chance of Cloud-Free Hill Top</h3>
        <p>{weather.cloud_free_top}</p>
      </div>

      <div>
        <h3>Visibility</h3>
        <p>{weather.visibility}</p>
      </div>

      <div>
        <h3>Wind</h3>
        <p>{weather.max_wind}</p>
      </div>

      <div>
        <h3>Temperature</h3>
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
    weather.days?.map((day, index) => {
      var dateList = day.date.split(" ");
      dateList[0] = weekdayDict[dateList[0]];
      dateList[2] = monthDict[dateList[2]];

      return (
        <div key={index} className="flex-column future weather-day">
          <div>
            <span className="secondary-text">Sunrise: {day.sunrise}, Sunset: {day.sunset}</span>
            <h2 className="subheading">{dateList.join(" ")}</h2>
          </div>
          <p>{day.summary}</p>
        </div>
      )
    })
  )
}


function DateTitle(dateString) {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  var date = new Date(dateString);

  return [weekday[date.getDay()], date.getDate(), month[date.getMonth()]].join(" ");
}

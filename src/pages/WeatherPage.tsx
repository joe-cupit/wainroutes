import "./WeatherPage.css";

import { Fragment, useEffect } from "react";
import setPageTitle from "../hooks/setPageTitle";
import { DistrictWeatherDayForecast, DistrictWeatherDay, useWeather } from "../contexts/WeatherContext";
import { WeatherIcon } from "../components/Icons";


export function WeatherPage() {

  setPageTitle("Lake District Weather Forecast");

  const { weather: weatherData, refresh: fetchWeather, loading, error } = useWeather();

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather])


  if (loading) return (<WeatherSkeleton />)
  else return (
    <main className="weather-page">

      <section>
        <div className="flex-column weather__main">
          <div className="weather__header">
            <h1 className="title">Lake District Weather Forecast</h1>
            <p className="secondary-text">{`Updated at: ${weatherData?.update_time}`}</p>
          </div>

          <div className="flex-column weather__days">
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


function CurrentDayWeather({ weather } : { weather : DistrictWeatherDay }) {

  return (
    <div className="weather__current-day">
      <div className="flex-column">
        <div>
          <h2 className="heading">{DateTitle(weather.date)}</h2>
          <p className="secondary-text">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</p>
        </div>

          <div className="weather__day">
            <p>{weather.weather}</p>

            <div className="weather__forecast">
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
      </div>

      <div className="weather__extra-details">
        <div className="weather__mountain-hazards">
          <h3 className="subheading">Mountain Hazards</h3>

          {weather.hazards
            ? <ul className="weather__mountain-hazards-list">
                {weather.hazards.high && Object.keys(weather.hazards.high).map((hazard, index) => {
                  return <li key={index} className="weather__mountain-hazard high">{hazard}</li>
                })}
                {weather.hazards.medium && Object.keys(weather.hazards.medium).map((hazard, index) => {
                  return <li key={index} className="weather__mountain-hazard medium">{hazard}</li>
                })}
                {weather.hazards.low && Object.keys(weather.hazards.low).map((hazard, index) => {
                  return <li key={index} className="weather__mountain-hazard low">{hazard}</li>
                })}
              </ul>
            : "None reported"
          }
        </div>

        <div className="weather__mountain-hazards">
          <h3 className="subheading">Meteorologist's View</h3>
          {weather.meteorologist_view && !weather.meteorologist_view.startsWith("Nothing")
            ? <p className="weather__meteorologist-view">{weather.meteorologist_view}</p>
            : <p>{weather.meteorologist_view ?? "Nothing to add"}</p>
          }
        </div>

      </div>
    </div>
  )
}


function ForecastRow({ title, data, postText, className } : { title: string; data: string[]; postText?: string; className?: string }) {
  return (
    <tr className={className}>
      <th>{title}</th>
      {data.map((entry, index) => <td key={index}>{entry}{postText}</td>)}
    </tr>
  )
}

function TypeRow({ title, data, className } : { title: string; data: string[]; className?: string}) {

  return (
    <tr className={className}>
      <th>{title}</th>
      {data.map((entry, index) => {
        const slug = entry.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "");
        return (
          <td key={index} className="image-cell" title={entry}>
            {WeatherIcon(slug)}
          </td>
        )
      })}
    </tr>
  )
}

function ForecastTable({ forecast } : { forecast: DistrictWeatherDayForecast | undefined }) {

  if (forecast === undefined) return <></>

  return (
    <table className="weather__forecast-table">
      <thead>
        <tr>
          <th></th>
          {forecast.time.map((time, index) => <th key={index}>{time}</th>)}
        </tr>
      </thead>
      <tbody>
        {forecast.type && <TypeRow title="Weather type" data={forecast.type} className={"primary-row"} />}
        {forecast.precip && <ForecastRow title="Precipitation %" data={forecast.precip} />}

        {forecast.temp && <ForecastRow title="Temperature (°C)" data={forecast.temp} postText={"°"} className={"primary-row"} />}
        {forecast.feel_temp && <ForecastRow title="Feels-like" data={forecast.feel_temp} postText={"°"} className={"secondary-row"} />}

        {forecast.wind_speed && <ForecastRow title="Wind speed (mph)" data={forecast.wind_speed} className={"primary-row"} />}
        {forecast.wind_gust && <ForecastRow title="Wind gusts" data={forecast.wind_gust} className={"secondary-row"} />}
      </tbody>
    </table>
  )
}


function TomorrowsWeather({ weather } : { weather: DistrictWeatherDay }) {
  return (
    <div className="flex-column weather__day">
      <div>
        <h2 className="heading">{DateTitle(weather.date)}</h2>
        <p className="secondary-text">Sunrise: {weather.sunrise}, Sunset: {weather.sunset}</p>
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
          {weather.temperature && Object.keys(weather.temperature).map((loc, index) => {
            return (
              <li key={index}>{loc}: {weather.temperature?.[loc]}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function FutureWeather({ weather } : { weather: DistrictWeatherDay }) {
  const weekdayDict = {
    "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" 
  } as { [shorthand : string] : string }
  const monthDict = {
    "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June", "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October","Nov": "November", "Dec": "December"
  } as { [shorthand : string] : string }

  return (
    <div>
      <h2 className="heading">Further Outlook</h2>

      <div className="weather__further-days">
        {weather.days?.map((day, index) => {
          var dateList = day.date.split(" ");
          dateList[0] = weekdayDict[dateList[0]];
          dateList[2] = monthDict[dateList[2]];
    
          return (
            <div key={index} className="flex-column future weather__day">
              <div>
                <h3 className="subheading">{dateList.join(" ")}</h3>
                <p className="secondary-text">Sunrise: {day.sunrise}, Sunset: {day.sunset}</p>
              </div>
              <p>{day.summary}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}


function DateTitle(dateString : string | undefined) {
  if (dateString === undefined) return "";

  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  var date = new Date(dateString);

  return [weekday[date.getDay()], date.getDate(), month[date.getMonth()]].join(" ");
}


function WeatherSkeleton() {
  return (
    <main className="weather-page skeleton">

      <section>
        <div className="flex-column weather__main">
          <div className="weather__header">
            <h1 className="title">Lake District Weather Forecast</h1>
            <p className="secondary-text"></p>
          </div>

          <div className="flex-column weather__days">
            <div className="weather__current-day">
              <div className="flex-column">
                <div>
                  <h2 className="heading"></h2>
                  <p className="secondary-text"></p>
                </div>

                  <div className="weather__day">
                    <p></p>

                    <div className="weather__forecast">
                      <h3></h3>
                      <p className="weather__table"></p>
                    </div>

                    <div>
                      <h3></h3>
                      <p></p>
                    </div>

                    <div>
                      <h3></h3>
                      <p></p>
                    </div>

                    <div>
                      <h3></h3>
                      <p></p>
                    </div>
                  </div>
              </div>

              <div className="weather__extra-details">
                <div className="weather__mountain-hazards">
                  <h3 className="subheading"></h3>
                  <p className="weather__mountain-hazards-list"></p>
                </div>

                <div className="weather__mountain-hazards">
                  <h3 className="subheading"></h3>
                  <p className="weather__meteorologist-view"></p>
                </div>

              </div>
            </div>

            <div className="flex-column weather__day">
              <div>
                <h2 className="heading"></h2>
                <p className="secondary-text"></p>
              </div>

              <p></p>

              <div>
                <h3></h3>
                <p></p>
              </div>

              <div>
                <h3></h3>
                <p></p>
              </div>

              <div>
                <h3></h3>
                <p></p>
              </div>

              <div>
                <h3></h3>
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="heading"></h2>

              <div className="weather__further-days">
                <div className="flex-column future weather__day">
                  <div>
                    <h3 className="subheading"></h3>
                    <p className="secondary-text"></p>
                  </div>
                  <p></p>
                </div>
                <div className="flex-column future weather__day">
                  <div>
                    <h3 className="subheading"></h3>
                    <p className="secondary-text"></p>
                  </div>
                  <p></p>
                </div>
                <div className="flex-column future weather__day">
                  <div>
                    <h3 className="subheading"></h3>
                    <p className="secondary-text"></p>
                  </div>
                  <p></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}

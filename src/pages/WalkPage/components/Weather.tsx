import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { displayDistance, displayElevation, displaySpeed, displayTemperature } from "../../../utils/unitConversions";


const WeatherSymbolsFolder = import.meta.glob("../../../assets/images/weather/*.svg");
let WeatherSymbols : { [name: string] : any } = {};
for (const path in WeatherSymbolsFolder) {
  WeatherSymbolsFolder[path]().then((mod : any) => {
    WeatherSymbols[path.split("/").at(-1) ?? ""] = mod.default;
  })
}


type IndividualWeatherDay = {
  date: string;
  weather_type: string[];
  temp: {
    screen: number[];
    max: number[];
    min: number[];
    feels: number[];
  }
  precipitation: {
    prob: number[];
    type: string[];
  }
  wind: {
    speed: number[];
    gusts: number[];
  }
  visibility: {
    m: number[];
    text: string[];
  }
}

type IndividualWeather = {
  request_date: string;
  name: string;
  elevation: number;
  coordinates: number[];
  days: IndividualWeatherDay[];
}


export function Weather({ secRef, weatherLoc } : { secRef: React.RefObject<HTMLDivElement>; weatherLoc: string | undefined }) {
  if (!weatherLoc) return <></>;

  const [weatherData, setWeatherData] = useState<IndividualWeather | null>(null);
  useEffect(() => {
    console.log(encodeURIComponent(weatherLoc))

    fetch('https://data.wainroutes.co.uk/weather_points.json?loc='+encodeURIComponent(weatherLoc))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch walk weather')
        return res.json()
      })
      .then((data) => setWeatherData(data))
      .catch((err) => {throw new Error(err.message)})
  }, [])

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDayWeather = useMemo(() =>
    weatherData ? weatherData?.days?.[selectedDayIndex] : null
  , [selectedDayIndex, weatherData])

  const formatDate = useCallback((dateString : string | undefined) => {
    if (!dateString) return "";

    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {weekday: 'long', month: 'long', day: 'numeric'});
  }, [])

  const [displayNightData, setDisplayNightData] = useState(0);


  return (
    <div ref={secRef}>
      <h2 className="subheading" id="walk_weather">Weather</h2>

      {weatherData
      ? <>
          <p>Forecast for <b>{weatherLoc} ({displayElevation(weatherData?.elevation)})</b></p>

          <div className="walk-page_weather-tabs flex-row justify-apart">
            {weatherData?.days?.map((day, index: number) => {
              let dayDate = new Date(day?.date)

              return (
                <button key={index}
                  className={"walk-page_weather-tab flex-column gap-0 align-center smallheading" + ([0, 6].includes(dayDate?.getDay()) ? " weekend" : "") + (index === selectedDayIndex ? " selected" : "")}
                  onClick={() => setSelectedDayIndex(index)}
                >
                  <span className="subtext">{days[dayDate?.getDay()]}</span>
                  <span className="subtext weather-day">{dayDate?.getDate()}</span>
                </button>
              )
            })}
          </div>

          <div className={"walks-page_section walks-page_weather-body flex-column" + (displayNightData ? " night-view" : "")}>
            <div className="walks-page_weather-header flex-row justify-apart align-center">
              <h3 className="subheading walks-page_weather-date">{formatDate(selectedDayWeather?.date)}</h3>
              <div className="walks-page_day-night">
                <button className={!displayNightData ? "active" : ""} onClick={() => setDisplayNightData(0)}>day</button>
                &nbsp;/&nbsp;
                <button className={displayNightData ? "active" : ""} onClick={() => setDisplayNightData(1)}>night</button>
              </div>
            </div>

            <div className="walks-page_weather-main flex-row align-center">
              <div className="flex-row gap-0 align-center">
                <div className="flex-column gap-0">
                  <span className="walks-page_weather-temp title">{displayTemperature(selectedDayWeather?.temp?.screen?.[displayNightData])}</span>

                  <div className="walks-page_weather-temps">
                    L: {displayTemperature(selectedDayWeather?.temp?.min?.[displayNightData], false)} H: {displayTemperature(selectedDayWeather?.temp?.max?.[displayNightData], false)}
                  </div>
                </div>

                <div className="walks-page_weather-symbol">
                  <img src={WeatherSymbols[`${(selectedDayWeather?.weather_type?.[displayNightData])?.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "")}.svg`]} alt={selectedDayWeather?.weather_type?.[displayNightData]} title={selectedDayWeather?.weather_type?.[displayNightData]} />
                </div>
              </div>

              <div className="walks-page_weather-grid grid-two gap-0">
                <div className="walks-page_weather-grid_box">
                  <h4>Feels-like</h4>
                  <p>{displayTemperature(selectedDayWeather?.temp?.feels?.[displayNightData], false)}</p>
                </div>
                <div className="walks-page_weather-grid_box">
                  <h4>Precipitation</h4>
                  <p className="default-value">{selectedDayWeather?.precipitation?.prob?.[displayNightData] + "%"}</p>
                  <p className="hover-value">{selectedDayWeather?.precipitation?.type?.[displayNightData]}</p>
                </div>
                <div className="walks-page_weather-grid_box">
                  <h4 className="default-value">Wind speed</h4>
                  <h4 className="hover-value">Wind gusts</h4>
                  <p className="default-value">{displaySpeed(selectedDayWeather?.wind?.speed?.[displayNightData])}</p>
                  <p className="hover-value">{displaySpeed(selectedDayWeather?.wind?.gusts?.[displayNightData])}</p>
                </div>
                <div className="walks-page_weather-grid_box">
                  <h4>Visibility</h4>
                  <p className="default-value">{selectedDayWeather?.visibility?.text?.[displayNightData]}</p>
                  <p className="hover-value">{displayDistance(selectedDayWeather?.visibility?.m?.[displayNightData] ?? 0 / 1000, 0)}</p>
                </div>
              </div>
            </div>

            <p className="walks-page_weather-info subtext">
              Provided by the <a href="https://www.metoffice.gov.uk/" target="_blank">Met Office</a> under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>.
            </p>
          </div>
        </>
      : <p>The forecast for this walk is currently unavailable.</p>
      }

      <p className="walks-page_weather-link">For the district-wide forecast, see the <Link to="/weather">mountain weather forecast</Link>.</p>
    </div>
  )
}
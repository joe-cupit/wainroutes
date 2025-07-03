import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { displayElevation, displaySpeed, displayTemperature, getDistanceUnit, getDistanceValue } from "../../../utils/unitConversions";
import { usePointWeather } from "../../../contexts/WeatherContext";


const WeatherSymbolsFolder = import.meta.glob("/src/assets/weather-icons/*.svg", { eager: true, import: "ReactComponent" });
let WeatherSymbols = Object.fromEntries(
  Object.entries(WeatherSymbolsFolder).map(([path, module]) => {
    const name = path.split("/").pop()?.replace(".svg", "");
    return [name, module];
  })
)


export function Weather({ secRef, weatherLoc } : { secRef: React.RefObject<HTMLDivElement>; weatherLoc: string | undefined }) {
  if (!weatherLoc) return <></>;

  const { weatherData } = usePointWeather(weatherLoc);

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
          <p>Forecast for <b>{weatherLoc} ({displayElevation(weatherData.elevation)})</b></p>

          <div className="walk-page_weather-tabs">
            {weatherData.days.map((day, index: number) => {
              let dayDate = new Date(day.date)

              return (
                <button key={index}
                  className={"walk-page_weather-tab flex-column gap-0 align-center smallheading" + ([0, 6].includes(dayDate.getDay()) ? " weekend" : "") + (index === selectedDayIndex ? " selected" : "")}
                  onClick={() => setSelectedDayIndex(index)}
                >
                  <span className="subtext">{days[dayDate.getDay()]}</span>
                  <span className="subtext weather-day">{dayDate.getDate()}</span>
                </button>
              )
            })}
          </div>

          {selectedDayWeather &&
            <div className={"walks-page_section walks-page_weather-body flex-column" + (displayNightData ? " night-view" : "")}>
              <div className="walks-page_weather-header flex-row justify-apart align-center">
                <h3 className="subheading walks-page_weather-date">{formatDate(selectedDayWeather.date)}</h3>
                <div className="walks-page_day-night">
                  <button className={!displayNightData ? "active" : ""} onClick={() => setDisplayNightData(0)}>day</button>
                  &nbsp;/&nbsp;
                  <button className={displayNightData ? "active" : ""} onClick={() => setDisplayNightData(1)}>night</button>
                </div>
              </div>

              <div className="walks-page_weather-main flex-row align-center">
                <div className="flex-row gap-0 align-center">
                  <div className="flex-column gap-0">
                    <span className="walks-page_weather-temp title">{displayTemperature(selectedDayWeather.temp.screen[displayNightData])}</span>

                    <div className="walks-page_weather-temps">
                      L: {displayTemperature(selectedDayWeather.temp.min[displayNightData], false)} H: {displayTemperature(selectedDayWeather.temp.max[displayNightData], false)}
                    </div>
                  </div>

                  <div className="walks-page_weather-symbol" title={selectedDayWeather.weather_type[displayNightData]}>
                    {WeatherIcon(selectedDayWeather.weather_type[displayNightData].toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, ""))}
                  </div>
                </div>

                <div className="walks-page_weather-grid grid-two gap-0">
                  <div className="walks-page_weather-grid_box">
                    <h4>Feels-like</h4>
                    <p>{displayTemperature(selectedDayWeather.temp.feels[displayNightData], false)}</p>
                  </div>
                  <div className="walks-page_weather-grid_box">
                    <h4>{"Chance of " + (selectedDayWeather.precipitation.type[displayNightData] ?? "precipitation")}</h4>
                    <p>{selectedDayWeather.precipitation.prob[displayNightData] + "%"}</p>
                  </div>
                  <div className="walks-page_weather-grid_box">
                    <h4>Wind speed (gusts)</h4>
                    <p>{
                      displaySpeed(selectedDayWeather.wind.speed[displayNightData])
                      + " (" + displaySpeed(selectedDayWeather.wind.gusts[displayNightData]) + ")"
                    }</p>
                  </div>
                  <div className="walks-page_weather-grid_box">
                    <h4>Visibility</h4>
                    <p className="default-value">{selectedDayWeather.visibility.text[displayNightData]}</p>
                    <p className="hover-value">{DisplayVisibilityDistance(selectedDayWeather.visibility.m[displayNightData])}</p>
                  </div>
                </div>
              </div>

              {/* <p className="walks-page_weather-info subtext">
                Provided by the <a href="https://www.metoffice.gov.uk/" target="_blank">Met Office</a> under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>.
              </p> */}
            </div>
          }
        </>
      : <p>The forecast for this walk is currently unavailable.</p>
      }

      <p className="walks-page_weather-link">For the district-wide forecast, see the <Link to="/weather">mountain weather forecast</Link>.</p>
    </div>
  )
}


function WeatherIcon(name: string) {
  const SvgIcon = WeatherSymbols[name];

  if (!SvgIcon) return null;
  return <SvgIcon />;
}


function DisplayVisibilityDistance(meters: number ) {
  const convertedValue = getDistanceValue(meters / 1000);
  const distanceUnit = getDistanceUnit(true);

  if (convertedValue == undefined) return "N/A" + distanceUnit;

  if (convertedValue < 1) {
    return "<1" + distanceUnit;
  }
  else if (convertedValue <= 5) {
    return convertedValue.toFixed(0) + distanceUnit;
  }
  else {
    return (Math.floor(convertedValue / 5) * 5).toFixed(0) + distanceUnit + "+";
  }
}

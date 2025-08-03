"use client"

import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import { displayElevation, displaySpeed, displayTemperature, getDistanceUnit, getDistanceValue } from "@/utils/unitConversions";
import WeatherIcons from "@/icons/WeatherIcons";

import tempweatherpoints from "@/data/weather_points.json";


export type PointWeatherDay = {
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

export type PointWeather = {
  request_date: string;
  name: string;
  elevation: number;
  coordinates: number[];
  days: PointWeatherDay[];
}


export default function Weather({ weatherLoc } : { weatherLoc: string }) {

  const weatherData = (tempweatherpoints as unknown as {[slug: string]: PointWeather})[weatherLoc];

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
    <div id="walk-weather">
      <h2 className={fontStyles.subheading} id="walk_weather">Weather</h2>

      {weatherData
      ? <>
          <p>Forecast for <b>{weatherLoc} ({displayElevation(weatherData.elevation)})</b></p>

          <div className={styles.weatherTabs}>
            {weatherData.days.map((day, index: number) => {
              const dayDate = new Date(day.date)

              return (
                <button key={index}
                  className={`${styles.weatherTab} ${[0, 6].includes(dayDate.getDay()) ? styles.weekend : ""} ${index === selectedDayIndex ? styles.selected : ""} ${fontStyles.smallheading}`}
                  onClick={() => setSelectedDayIndex(index)}
                >
                  <span className={fontStyles.subtext}>{days[dayDate.getDay()]}</span>
                  <span className={`${fontStyles.subtext} ${styles.weatherDay}`}>{dayDate.getDate()}</span>
                </button>
              )
            })}
          </div>

          {selectedDayWeather &&
            <div className={`${styles.section} ${styles.weatherBody} ${displayNightData ? styles.nightView : ""}`}>
              <div className={styles.weatherHeader}>
                <h3 className={fontStyles.subheading}>{formatDate(selectedDayWeather.date)}</h3>
                <div className={styles.dayNight}>
                  <button className={!displayNightData ? styles.active : ""} onClick={() => setDisplayNightData(0)}>day</button>
                  &nbsp;/&nbsp;
                  <button className={displayNightData ? styles.active : ""} onClick={() => setDisplayNightData(1)}>night</button>
                </div>
              </div>

              <div className={styles.weatherMain}>
                <div className={styles.weatherMainRow}>
                  <div className={styles.weatherMainCol}>
                    <span className={`${styles.weatherTemps} ${fontStyles.title}`}>{displayTemperature(selectedDayWeather.temp.screen[displayNightData])}</span>

                    <div className={styles.weatherTemps}>
                      L: {displayTemperature(selectedDayWeather.temp.min[displayNightData], false)} H: {displayTemperature(selectedDayWeather.temp.max[displayNightData], false)}
                    </div>
                  </div>

                  <div className={styles.weatherSymbol} title={selectedDayWeather.weather_type[displayNightData]}>
                    {RenderWeatherIcon(selectedDayWeather.weather_type[displayNightData])}
                  </div>
                </div>

                <div className={styles.weatherGrid}>
                  <div className={styles.weatherGridBox}>
                    <h4>Feels-like</h4>
                    <p>{displayTemperature(selectedDayWeather.temp.feels[displayNightData], false)}</p>
                  </div>
                  <div className={styles.weatherGridBox}>
                    <h4>{"Chance of " + (selectedDayWeather.precipitation.type[displayNightData] ?? "precipitation")}</h4>
                    <p>{selectedDayWeather.precipitation.prob[displayNightData] + "%"}</p>
                  </div>
                  <div className={styles.weatherGridBox}>
                    <h4>Wind speed (gusts)</h4>
                    <p>{
                      displaySpeed(selectedDayWeather.wind.speed[displayNightData])
                      + " (" + displaySpeed(selectedDayWeather.wind.gusts[displayNightData]) + ")"
                    }</p>
                  </div>
                  <div className={styles.weatherGridBox}>
                    <h4>Visibility</h4>
                    <p className={styles.defaultValue}>{selectedDayWeather.visibility.text[displayNightData]}</p>
                    <p className={styles.hoverValue}>{DisplayVisibilityDistance(selectedDayWeather.visibility.m[displayNightData])}</p>
                  </div>
                </div>
              </div>

              {/* <p className={`${styles.weatherInfo} ${fontStyles.subtext}`}>
                Provided by the <a href="https://www.metoffice.gov.uk/" target="_blank">Met Office</a> under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>.
              </p> */}
            </div>
          }
        </>
      : <p>The forecast for this walk is currently unavailable.</p>
      }

      <p className={styles.weatherLink}>For the district-wide forecast, see the <Link href="/weather">mountain weather forecast</Link>.</p>
    </div>
  )
}


function RenderWeatherIcon(uncleanString: string ) {
  const slug = uncleanString.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "");
  const Icon = WeatherIcons[slug];

  return (
    <Icon />
  )
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

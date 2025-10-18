"use client";

import styles from "./Weather.module.css";

import React, { useCallback, useMemo, useState } from "react";

import { PointWeather } from "@/types/Weather";
import {
  displaySpeed,
  displayTemperature,
  getDistanceUnit,
  getDistanceValue,
} from "@/utils/unitConversions";
import WeatherIcons from "@/icons/WeatherIcons";

export default function WeatherClient({
  weatherData,
}: {
  weatherData: PointWeather;
}) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDayWeather = useMemo(
    () => weatherData.days[selectedDayIndex],
    [selectedDayIndex, weatherData]
  );

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return "";

    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const [displayNightData, setDisplayNightData] = useState(0);

  return (
    <div className={styles.weather} data-nighttime={displayNightData === 1}>
      <div className={styles.tabs}>
        {weatherData.days.slice(0, 6).map((day, index: number) => {
          const dayDate = new Date(day.date);
          const dayWeather = weatherData.days[index];

          return (
            <button
              key={index}
              className={`
                ${styles.tab} 
                ${index === selectedDayIndex ? styles.selected : ""}
              `}
              onClick={() => setSelectedDayIndex(index)}
            >
              <div className={styles.tabDate}>
                {RenderWeatherIcon(dayWeather.weather_type[displayNightData])}
                <span className={styles.tabDayLong}>
                  {days[dayDate.getDay()]}
                </span>
                <span className={styles.tabDayShort}>
                  {days[dayDate.getDay()].slice(0, 3)}
                </span>
              </div>

              <div className={styles.tabTemp}>
                <span>
                  {displayTemperature(
                    dayWeather.temp.min[displayNightData],
                    false
                  )}
                </span>{" "}
                /{" "}
                <span>
                  {displayTemperature(
                    dayWeather.temp.max[displayNightData],
                    false
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.main} data-day={selectedDayIndex}>
        <div className={styles.heading}>
          <h3 className={styles.date}>{formatDate(selectedDayWeather.date)}</h3>
          <div className={styles.dayNight}>
            <label>
              <input
                type="radio"
                name="daytime"
                checked={displayNightData === 0}
                onClick={() => setDisplayNightData(0)}
              />
              daytime
            </label>
            {" / "}
            <label>
              <input
                type="radio"
                name="daytime"
                checked={displayNightData === 1}
                onClick={() => setDisplayNightData(1)}
              />
              nighttime
            </label>
          </div>
        </div>
        <div className={styles.overview}>
          {RenderWeatherIcon(selectedDayWeather.weather_type[displayNightData])}

          <div className={styles.overviewMain}>
            <div className={styles.overviewTemp}>
              {displayTemperature(
                selectedDayWeather.temp.screen[displayNightData]
              )}
            </div>
            <div>
              {selectedDayWeather.weather_type[displayNightData].replace(
                /\(.+\)/g,
                ""
              )}
            </div>
          </div>
          {/* <div className={styles.detail}>
            <h4>Feels-like</h4>
            <p>
              {displayTemperature(
                selectedDayWeather.temp.feels[displayNightData],
                false
              )}
            </p>
          </div> */}
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <h4>Wind speed</h4>
            <p>
              {displaySpeed(selectedDayWeather.wind.speed[displayNightData])}
            </p>
          </div>
          <div className={styles.detail}>
            <h4>Wind gusts</h4>
            <p>
              {displaySpeed(selectedDayWeather.wind.gusts[displayNightData])}
            </p>
          </div>
          <div className={styles.detail}>
            <h4>
              {"Chance of " +
                (selectedDayWeather.precipitation.type[displayNightData] ??
                  "precipitation")}
            </h4>
            <p>
              {selectedDayWeather.precipitation.prob[displayNightData] + "%"}
            </p>
          </div>
          <div className={styles.detail}>
            <h4>Visibility</h4>
            <p className={styles.defaultValue}>
              <span className={styles.visibilityLong}>
                {selectedDayWeather.visibility.text[displayNightData] +
                  " (" +
                  DisplayVisibilityDistance(
                    selectedDayWeather.visibility.m[displayNightData]
                  ) +
                  ")"}
              </span>
              <span className={styles.visibilityShort}>
                {selectedDayWeather.visibility.text[displayNightData]}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderWeatherIcon(uncleanString: string) {
  const slug = uncleanString
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[()]/g, "");
  const Icon = WeatherIcons[slug];

  return <Icon />;
}

function DisplayVisibilityDistance(meters: number) {
  const convertedValue = getDistanceValue(meters / 1000);
  const distanceUnit = getDistanceUnit(true);

  if (convertedValue == undefined) return "N/A" + distanceUnit;

  if (convertedValue < 1) {
    return "<1" + distanceUnit;
  } else if (convertedValue <= 5) {
    return convertedValue.toFixed(0) + distanceUnit;
  } else {
    return (Math.floor(convertedValue / 5) * 5).toFixed(0) + distanceUnit + "+";
  }
}

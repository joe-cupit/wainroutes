import styles from "./Weather.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { Fragment } from "react";
import { createPageMetadata } from "@/utils/metadata";

import {
  DistrictWeather,
  DistrictWeatherDay,
  DistrictWeatherDayForecast,
} from "@/types/Weather";
import formatDateString from "@/utils/formatDateString";
import WeatherIcons from "@/icons/WeatherIcons";

export function generateMetadata() {
  return createPageMetadata({
    title: "Lake District Mountain Weather Forecast",
    description:
      "Get the latest 5-day mountain weather forecast for the Lake District, with summit visibility and current mountain hazards.",
    path: "/weather",
  });
}

async function getWeather() {
  const res = await fetch("https://data.wainroutes.co.uk/weather.json", {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    console.error("Failed to fetch weather data:", res);
    return {};
  }

  return res.json();
}

export default async function WeatherPage() {
  const weatherData: DistrictWeather = await getWeather();

  return (
    <main className={styles.weather}>
      <section>
        <div className={styles.main}>
          <div className={styles.header}>
            <h1 className={fontStyles.title}>Lake District Weather Forecast</h1>
            <p
              className={styles.subtext}
            >{`Issued: ${weatherData?.update_time}`}</p>
          </div>

          <div className={styles.days}>
            {weatherData?.days?.map((day, index) => {
              switch (day.type) {
                case "current-day":
                  return <CurrentDayWeather key={index} weather={day} />;
                case "tomorrows-tab":
                  return <TomorrowsWeather key={index} weather={day} />;
                case "further-outlook":
                  return <FutureWeather key={index} weather={day} />;
                default:
                  return <Fragment key={index}></Fragment>;
              }
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function CurrentDayWeather({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <div className={styles.currentDay}>
      <div className={styles.currentDayMain}>
        <div>
          <h2 className={fontStyles.heading}>
            {formatDateString(weather.date)}
          </h2>
          <p className={styles.subtext}>
            Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
          </p>
        </div>

        <div className={styles.day}>
          <p>{weather.weather}</p>

          <div>
            <h3 className={styles.subheading}>
              Mountain Weather Forecast (800m)
            </h3>
            <ForecastTable forecast={weather.forecast} />
          </div>

          <div>
            <h3 className={styles.subheading}>Chance of Cloud-Free Hill Top</h3>
            <p>{weather.cloud_free_top}</p>
          </div>

          <div>
            <h3 className={styles.subheading}>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>

          <div>
            <h3 className={styles.subheading}>Summary</h3>
            <p>{weather.summary}</p>
          </div>
        </div>
      </div>

      <div className={styles.extraDetails}>
        <div className={styles.mountainHazards}>
          <h3 className={fontStyles.subheading}>Mountain Hazards</h3>

          {weather.hazards ? (
            <ul className={styles.mountainHazardsList}>
              {weather.hazards.high &&
                Object.keys(weather.hazards.high).map((hazard, index) => {
                  return (
                    <li key={index} className={styles.mountainHazardHigh}>
                      {hazard}
                    </li>
                  );
                })}
              {weather.hazards.medium &&
                Object.keys(weather.hazards.medium).map((hazard, index) => {
                  return (
                    <li key={index} className={styles.mountainHazardMedium}>
                      {hazard}
                    </li>
                  );
                })}
              {weather.hazards.low &&
                Object.keys(weather.hazards.low).map((hazard, index) => {
                  return (
                    <li key={index} className={styles.mountainHazardLow}>
                      {hazard}
                    </li>
                  );
                })}
            </ul>
          ) : (
            "None reported"
          )}
        </div>

        <div className={styles.mountainHazards}>
          <h3 className={fontStyles.subheading}>Meteorologist&apos;s View</h3>
          {weather.meteorologist_view &&
          !weather.meteorologist_view.startsWith("Nothing") ? (
            <p className={styles.meteorologistView}>
              {weather.meteorologist_view}
            </p>
          ) : (
            <p>{weather.meteorologist_view ?? "Nothing to add"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ForecastRow({
  title,
  data,
  postText,
  className,
}: {
  title: string;
  data: string[];
  postText?: string;
  className?: string;
}) {
  return (
    <tr className={className}>
      <th>{title}</th>
      {data.map((entry, index) => (
        <td key={index}>
          {entry}
          {postText}
        </td>
      ))}
    </tr>
  );
}

function TypeRow({
  title,
  data,
  className,
}: {
  title: string;
  data: string[];
  className?: string;
}) {
  return (
    <tr className={className}>
      <th>{title}</th>
      {data.map((entry, index) => {
        const slug = entry
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll(/[()]/g, "");
        const Icon = WeatherIcons[slug] || WeatherIcons["cloudy"];
        return (
          <td key={index} className={styles.imageCell} title={entry}>
            <Icon />
          </td>
        );
      })}
    </tr>
  );
}

function ForecastTable({
  forecast,
}: {
  forecast: DistrictWeatherDayForecast | undefined;
}) {
  if (forecast === undefined) return <></>;

  return (
    <div className={styles.forecast}>
      <table className={styles.forecastTable}>
        <thead>
          <tr>
            <th></th>
            {forecast.time.map((time, index) => (
              <th key={index}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forecast.type && (
            <TypeRow
              title="Weather type"
              data={forecast.type}
              className={styles.primaryRow}
            />
          )}
          {forecast.precip && (
            <ForecastRow title="Precipitation %" data={forecast.precip} />
          )}
          {forecast.temp && (
            <ForecastRow
              title="Temperature (°C)"
              data={forecast.temp}
              postText={"°"}
              className={styles.primaryRow}
            />
          )}
          {forecast.feel_temp && (
            <ForecastRow
              title="Feels-like"
              data={forecast.feel_temp}
              postText={"°"}
              className={styles.secondaryRow}
            />
          )}
          {forecast.wind_speed && (
            <ForecastRow
              title="Wind speed (mph)"
              data={forecast.wind_speed}
              className={styles.primaryRow}
            />
          )}
          {forecast.wind_gust && (
            <ForecastRow
              title="Wind gusts"
              data={forecast.wind_gust}
              className={styles.secondaryRow}
            />
          )}
        </tbody>
      </table>
    </div>
  );
}

function TomorrowsWeather({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <div className={styles.day}>
      <div>
        <h2 className={fontStyles.heading}>{formatDateString(weather.date)}</h2>
        <p className={styles.subtext}>
          Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
        </p>
      </div>

      <p>{weather.summary}</p>

      <div>
        <h3 className={styles.subheading}>Chance of Cloud-Free Hill Top</h3>
        <p>{weather.cloud_free_top}</p>
      </div>

      <div>
        <h3 className={styles.subheading}>Visibility</h3>
        <p>{weather.visibility}</p>
      </div>

      <div>
        <h3 className={styles.subheading}>Wind</h3>
        <p>{weather.max_wind}</p>
      </div>

      <div>
        <h3 className={styles.subheading}>Temperature</h3>
        <ul>
          {weather.temperature &&
            Object.keys(weather.temperature).map((loc, index) => {
              return (
                <li key={index}>
                  {loc}: {weather.temperature?.[loc]}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

function FutureWeather({ weather }: { weather: DistrictWeatherDay }) {
  const weekdayDict = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  } as { [shorthand: string]: string };
  const monthDict = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  } as { [shorthand: string]: string };

  return (
    <div>
      <h2 className={fontStyles.heading}>Further Outlook</h2>

      <div className={styles.furtherDays}>
        {weather.days?.map((day, index) => {
          const dateList = day.date.split(" ");
          dateList[0] = weekdayDict[dateList[0]];
          dateList[2] = monthDict[dateList[2]];

          return (
            <div key={index} className={`${styles.day} ${styles.future}`}>
              <div>
                <h3 className={fontStyles.subheading}>{dateList.join(" ")}</h3>
                <p className={styles.subtext}>
                  Sunrise: {day.sunrise}, Sunset: {day.sunset}
                </p>
              </div>
              <p>{day.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

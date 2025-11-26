import styles from "../Weather.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { Fragment } from "react";

import {
  DistrictWeather,
  DistrictWeatherDay,
  DistrictWeatherDayForecast,
} from "@/types/Weather";
import WeatherIcons from "@/icons/WeatherIcons";
import formatDateString from "@/utils/formatDateString";
import {
  PrecipitationIcon,
  TemperatureIcon,
  WindIcon,
} from "@/icons/PhosphorIcons";

export function Forecast({ weatherData }: { weatherData: DistrictWeather }) {
  return (
    <div className={styles.forecast}>
      {weatherData?.days?.map((day, index) => {
        switch (day.type) {
          case "current-day":
            return <TodayForecast key={index} weather={day} />;
          case "tomorrows-tab":
            return <TomorrowForecast key={index} weather={day} />;
          case "further-outlook":
            return <FutureForecast key={index} weather={day} />;
          default:
            return <Fragment key={index}></Fragment>;
        }
      })}

      <p className={styles.metoffice}>
        Forecast provided by the{" "}
        <a href="https://www.metoffice.gov.uk/" target="_blank">
          Met Office
        </a>{" "}
        under the{" "}
        <a
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          target="_blank"
        >
          Open Government Licence
        </a>
        .
      </p>
    </div>
  );
}

function ForecastDay({
  sticky,
  main,
}: {
  sticky: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div className={styles.forecastRow}>
      <div className={styles.forecastSticky}>{sticky}</div>
      <div className={styles.forecastMain}>{main}</div>
    </div>
  );
}

function TodayForecast({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <ForecastDay
      sticky={
        <>
          <div>
            <h2 className={fontStyles.subheading}>
              {formatDateString(weather.date)}
            </h2>
            <p className={styles.suntime}>
              Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
            </p>
          </div>
          <div className={styles.additionalInfo}>
            <div>
              <h3 className={styles.boldheading}>Mountain Hazards</h3>
              <MountainHazardList hazards={weather.hazards} />
            </div>
            <div>
              <h3 className={styles.boldheading}>Meteorologist&apos;s View</h3>
              <MeteorologistView view={weather.meteorologist_view} />
            </div>
          </div>
        </>
      }
      main={
        <>
          <div>
            <h3 className="visually-hidden">Summary</h3>
            <p>{weather.summary}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Mountain Forecast (900m)</h3>
            <WeatherTable forecast={weather.forecast} />
          </div>
          <div>
            <h3 className={styles.boldheading}>
              Chance of Cloud-Free Hill Top
            </h3>
            <p>{weather.cloud_free_top}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>
          <div className={styles.additionalInfo}>
            <div>
              <h3 className={styles.boldheading}>Mountain Hazards</h3>
              <MountainHazardList hazards={weather.hazards} />
            </div>
            <div>
              <h3 className={styles.boldheading}>Meteorologist&apos;s View</h3>
              <MeteorologistView view={weather.meteorologist_view} />
            </div>
          </div>
        </>
      }
    />
  );
}

function TomorrowForecast({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <ForecastDay
      sticky={
        <>
          <div>
            <h2 className={fontStyles.subheading}>
              {formatDateString(weather.date)}
            </h2>
            <p className={styles.suntime}>
              Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
            </p>
          </div>
        </>
      }
      main={
        <>
          <div>
            <h3 className="visually-hidden">Summary</h3>
            <p>{weather.summary}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>
              Chance of Cloud-Free Hill Top
            </h3>
            <p>{weather.cloud_free_top}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Wind</h3>
            <p>{weather.max_wind}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Temperature</h3>
            {weather.temperature && (
              <ul className={styles.temperatureList}>
                {Object.keys(weather.temperature).map((loc, index) => {
                  return (
                    <li key={index}>
                      {loc}: {weather.temperature?.[loc]}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      }
    />
  );
}

function FutureForecast({ weather }: { weather: DistrictWeatherDay }) {
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
    <div className={styles.futureForecast}>
      <h2 className={`${fontStyles.heading} ${styles.furtherTitle}`}>
        Further Outlook
      </h2>

      {weather.days?.map((day, index) => {
        const dateList = day.date.split(" ");
        dateList[0] = weekdayDict[dateList[0]];
        dateList[2] = monthDict[dateList[2]].slice(0, 3);

        return (
          <ForecastDay
            key={index}
            sticky={
              <div>
                <h3 className={fontStyles.subheading}>{dateList.join(" ")}</h3>
                <p className={styles.suntime}>
                  Sunrise: {day.sunrise}, Sunset: {day.sunset}
                </p>
              </div>
            }
            main={
              <div>
                <h3 className="visually-hidden">Summary</h3>
                <p>{day.summary}</p>
              </div>
            }
          />
        );
      })}
    </div>
  );
}

//

function MountainHazardList({
  hazards,
}: {
  hazards?: DistrictWeatherDay["hazards"];
}) {
  if (!hazards) return "None reported.";

  const renderHazards = (
    level: string,
    hazardObj?: { [name: string]: string }
  ) => {
    if (!hazardObj) return <></>;

    return Object.keys(hazardObj).map((hazard, index) => {
      return (
        <li key={index} className={`${styles.mountainHazard} ${level}`}>
          {hazard}
        </li>
      );
    });
  };

  return (
    <ul className={styles.mountainHazards}>
      {renderHazards(styles.high, hazards.high)}
      {renderHazards(styles.medium, hazards.medium)}
      {renderHazards(styles.low, hazards.low)}
    </ul>
  );
}

function MeteorologistView({
  view,
}: {
  view?: DistrictWeatherDay["meteorologist_view"];
}) {
  if (view && !view.startsWith("Nothing")) {
    return <p className={styles.meteorologistView}>{view}</p>;
  }

  return <p>{view ?? "Nothing to add."}</p>;
}

function WeatherTable({ forecast }: { forecast?: DistrictWeatherDayForecast }) {
  if (forecast === undefined) return <p>Unavailable.</p>;

  return (
    <div className={styles.weatherTableContainer}>
      <table className={styles.weatherTable}>
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
            <WeatherTypeRow title="Weather type" data={forecast.type} />
          )}
          {forecast.precip && (
            <WeatherTableRow
              icon={<PrecipitationIcon />}
              title="Precipitation %"
              data={forecast.precip}
            />
          )}
          {forecast.temp && (
            <WeatherTableRow
              icon={<TemperatureIcon />}
              title="Temperature (°C)"
              data={forecast.temp}
              postText={"°"}
              className={styles.primaryRow}
            />
          )}
          {forecast.feel_temp && (
            <WeatherTableRow
              icon="(°C)"
              title="Feels-like"
              data={forecast.feel_temp}
              postText={"°"}
              className={styles.secondaryRow}
            />
          )}
          {forecast.wind_speed && (
            <WeatherTableRow
              icon={<WindIcon />}
              title="Wind speed (mph)"
              data={forecast.wind_speed}
              className={styles.primaryRow}
            />
          )}
          {forecast.wind_gust && (
            <WeatherTableRow
              icon="(mph)"
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

function WeatherTableRow({
  icon,
  title,
  data,
  postText,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  data: string[];
  postText?: string;
  className?: string;
}) {
  return (
    <tr className={className}>
      <th>
        {icon && <span className={styles.rowIcon}>{icon}</span>}
        <span className={styles.rowTitle}>{title}</span>
      </th>
      {data.map((entry, index) => (
        <td key={index}>
          {entry}
          {postText}
        </td>
      ))}
    </tr>
  );
}
function WeatherTypeRow({
  icon,
  title,
  data,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  data: string[];
  className?: string;
}) {
  return (
    <tr className={className}>
      <th>
        {icon && <span className={styles.rowIcon}>{icon}</span>}
        <span className={styles.rowTitle}>{title}</span>
      </th>
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

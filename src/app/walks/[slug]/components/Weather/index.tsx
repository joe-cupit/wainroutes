import styles from "../../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";

import Link from "next/link";

import { PointWeather } from "@/types/Weather";
import { displayElevation } from "@/utils/unitConversions";

import WeatherClient from "./WeatherClient";


async function getWeatherPoint() {
  const res = await fetch(
    "https://data.wainroutes.co.uk/weather_points.json",
    {next: { revalidate: 3600 }}
  );

  if (!res.ok) {
    console.error("Failed to fetch weather data:", res);
    return {};
  }

  return res.json();
}


export default async function Weather({ weatherLoc } : { weatherLoc: string }) {

  const weatherData = (await getWeatherPoint() as {[name: string]: PointWeather})[weatherLoc];


  return (
    <div id="walk-weather">
      <h2 className={fontStyles.subheading} id="walk_weather">Weather</h2>

      {weatherData
      ? <>
          <p>Forecast for <b>{weatherLoc} ({displayElevation(weatherData.elevation)})</b></p>

          <WeatherClient weatherData={weatherData} />
        </>
      : <p>The forecast for this walk is currently unavailable.</p>
      }

      <p className={styles.weatherLink}>For the district-wide forecast, see the <Link href="/weather">mountain weather forecast</Link>.</p>
    </div>
  )
}

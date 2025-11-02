import styles from "./Weather.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import { DistrictWeather } from "@/types/Weather";
import { Forecast } from "./components/Forecast";

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
          <div>
            <h1 className={fontStyles.title}>Lake District Weather Forecast</h1>
            <UpdateDate date={weatherData.update_time} />
          </div>

          <Forecast weatherData={weatherData} />

          <div style={{ height: "3rem" }}></div>
        </div>
      </section>
    </main>
  );
}

function UpdateDate({ date }: { date: string }) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const updateDate = new Date(date + " UTC");

  return (
    <p className={styles.suntime}>
      {`Updated at:
        ${updateDate.toTimeString().slice(0, 5)}
        on
        ${weekdays[updateDate.getDay()].slice(0, 3)}
        ${updateDate.getDate()}
        ${months[updateDate.getMonth()].slice(0, 3)}
        ${updateDate.getFullYear()}`}
    </p>
  );
}

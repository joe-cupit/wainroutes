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
            <p className={styles.suntime}>
              {`Updated at: ${weatherData?.update_time}`}
            </p>
          </div>

          <Forecast weatherData={weatherData} />

          <div style={{ height: "3rem" }}></div>
        </div>
      </section>
    </main>
  );
}

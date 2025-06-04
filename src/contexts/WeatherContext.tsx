import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";


export type DistrictWeatherDayForecast = {
  time: string[];
  type?: string[];
  precip?: string[];
  wind_speed?: string[];
  wind_gust?: string[];
  wind_dir?: string[];
  temp?: string[];
  feel_temp?: string[];
}

export type DistrictWeatherDay = {
  type: string;
  date?: string;
  sunrise?: string;
  sunset?: string;
  hazards?: {
    [level: string]: {[name: string] : string}
  };
  meteorologist_view?: string;
  summary?: string;
  cloud_free_top?: string;
  visibility?: string;
  ground_conditions?: string;
  weather?: string;
  forecast?: DistrictWeatherDayForecast;
  max_wind?: string;
  temperature?: {
    [height: string]: string;
  }
  days?: {
    date: string;
    sunrise?: string;
    sunset?: string;
    summary?: string;
  }[]
}

export type DistrictWeather = {
  update_time: string;
  confidence?: string;
  days: DistrictWeatherDay[];
}

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



type WeatherContextType = {
  weather: DistrictWeather | undefined;
  loading: boolean;
  error: Error | null;
  refresh: CallableFunction;

  pointWeather: {[slug: string]: PointWeather} | undefined;
  pointLoading: boolean;
  pointError: Error | null;
  pointRefresh: CallableFunction;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);


export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used in WeatherProvider');
  return context;
}

export const usePointWeather = (slug?: string) => {
  const { pointWeather, pointLoading, pointRefresh } = useWeather();
  if (!pointWeather) pointRefresh();

  return { weatherData: pointWeather?.[slug ?? ""], weatherLoading: pointLoading }
}


export const WeatherProvider = ({ children } : { children : ReactNode }) => {

  const [districtWeather, setDistrictWeather] = useState<DistrictWeather>();
  const [districtLoading, setDistrictLoading] = useState(true);
  const [districtError, setDistrictError] = useState<Error | null>(null);

  const fetchDistrictData = useCallback(async () => {
    fetch('https://data.wainroutes.co.uk/weather.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setDistrictWeather(data))
      .catch((err) => {
        console.error("Error fetching district weather");
        setDistrictError(err);
      })
      .finally(() => setDistrictLoading(false))
  }, [])


  const [pointWeather, setPointWeather] = useState<{[slug: string]: PointWeather}>();
  const [pointLoading, setPointLoading] = useState(true);
  const [pointError, setPointError] = useState<Error | null>(null);

  const fetchPointData = useCallback(async () => {
    fetch('https://data.wainroutes.co.uk/weather_points.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setPointWeather(data))
      .catch((err) => {
        console.error("Error fetching weather points");
        setPointError(err);
      })
      .finally(() => setPointLoading(false))
  }, [])


  const value = {
    weather: districtWeather,
    loading: districtLoading,
    error: districtError,
    refresh: fetchDistrictData,

    pointWeather: pointWeather,
    pointLoading: pointLoading,
    pointError: pointError,
    pointRefresh: fetchPointData,
  }

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}

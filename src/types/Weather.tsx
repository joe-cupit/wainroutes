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

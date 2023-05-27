import dotenv from 'dotenv';
import { OpenWeatherAPI } from 'openweather-api-node';
import { parseEnv, z } from 'znv';
import { SimplifiedHourlyWeather } from './schemas';
import { scoreEachHour } from './compare';

dotenv.config();

const {
    OPEN_WEATHER_API_KEY: API_KEY,
    LOCATION_COORDINATES: COORDINATES,
    LOCATION_NAME,
} = parseEnv(process.env, {
    OPEN_WEATHER_API_KEY: z.string(),
    LOCATION_COORDINATES: z.array(z.number()).default([43.65107, -79.347015]),
    LOCATION_NAME: z.string().optional().default('Toronto, Canada'),
});

const weather = new OpenWeatherAPI({
    key: API_KEY,
    units: 'metric',
    coordinates: { lat: COORDINATES[0], lon: COORDINATES[1] },
});

getWeatherForecast();

async function getWeatherForecast(): Promise<SimplifiedHourlyWeather[]> {
    const hourlyConditions: SimplifiedHourlyWeather[] = [];
    const hourlyForecast = await weather.getHourlyForecast();

    for (const hour of hourlyForecast) {
        if (hour.dt.getHours() > 6 && hour.dt.getHours() < 19) {
            hourlyConditions.push({
                localDt: hour.dt.toLocaleString(),
                temperature: hour.weather.temp.cur,
                humidity: hour.weather.humidity,
                clouds: hour.weather.clouds,
                uvi: hour.weather.uvi,
                rain: hour.weather.rain,
                snow: hour.weather.snow,
            });
            console.log(
                hour.dt.toLocaleString(),
                scoreEachHour(hourlyConditions[hourlyConditions.length - 1]),
            );
        }
    }

    return hourlyConditions;
}

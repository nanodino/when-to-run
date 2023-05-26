import dotenv from 'dotenv';
import { OpenWeatherAPI } from 'openweather-api-node';
import { parseEnv } from 'znv';
import { z } from 'zod';

dotenv.config();

const {
    OPEN_WEATHER_API_KEY: API_KEY,
    LOCATION_COORDINATES: COORDINATES,
    LOCATION_NAME,
} = parseEnv(process.env, {
    OPEN_WEATHER_API_KEY: z.string(),
    LOCATION_COORDINATES: z.array(z.number()).default([43.65107, -79.347015]),
    LOCATION_NAME: z.string().optional().default('Toronto'),
});

const weather = new OpenWeatherAPI({
    key: API_KEY,
    locationName: LOCATION_NAME,
    units: 'metric',
});

weather.getHourlyForecast().then((hourlyData) => {
    console.log(hourlyData);
});

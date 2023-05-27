import dotenv from 'dotenv';
import { parseEnv, z } from 'znv';
import { OpenWeatherAPI } from 'openweather-api-node';
import * as functions from './functions';

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

export const weather = new OpenWeatherAPI({
    key: API_KEY,
    units: 'metric',
    coordinates: { lat: COORDINATES[0], lon: COORDINATES[1] },
});

run();

async function run() {
    const hourlyConditions = await functions.getWeatherForecast();
    functions.findBestTime(hourlyConditions);
}

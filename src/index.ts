import { Client, GatewayIntentBits } from 'discord.js';
import { parseEnv, z } from 'znv';
import dotenv from 'dotenv';
import { ready, interactionCreate } from './listener';
import { OpenWeatherAPI } from 'openweather-api-node';

dotenv.config();

const {
    OPEN_WEATHER_API_KEY: API_KEY,
    LOCATION_COORDINATES: COORDINATES,
    LOCATION_NAME,
    TOKEN,
} = parseEnv(process.env, {
    OPEN_WEATHER_API_KEY: z.string(),
    LOCATION_COORDINATES: z.array(z.number()).default([43.65107, -79.347015]),
    LOCATION_NAME: z.string().optional().default('Toronto, Canada'),
    TOKEN: z.string(),
});

export const weather = new OpenWeatherAPI({
    key: API_KEY,
    units: 'metric',
    locationName: LOCATION_NAME,
});

console.log('Starting runbot');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(TOKEN);
ready(client);
interactionCreate(client);

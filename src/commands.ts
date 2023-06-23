import {
    ChatInputApplicationCommandData,
    Client,
    ChatInputCommandInteraction,
} from 'discord.js';
import * as functions from './functions';

interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: ChatInputCommandInteraction) => void;
}

export const Ping: Command = {
    name: 'ping',
    description: 'Returns a pong',
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const content = 'Pong!';
        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};

export const SuggestRunTime: Command = {
    name: 'suggest-run-time',
    description: 'Suggests best time to run in Toronto in the next 48 hours',
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const content = await whenToRun();
        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};

export const Commands = [Ping, SuggestRunTime];

export async function whenToRun(): Promise<string> {
    const hourlyConditions = await functions.getWeatherForecast();
    const winner = functions.findBestTime(hourlyConditions);
    return `The best time to go for a run in the next 48 hours is ${winner.hourlyConditions.localDt}.
The temperature will be ${winner.hourlyConditions.temperature} celsius, with a relative humidity of ${winner.hourlyConditions.humidity}% and a UVI index of ${winner.hourlyConditions.uvi}`;
}

import { SimplifiedHourlyWeather } from './schemas';
import { weather } from '.';

const idealRunningConditions: Omit<SimplifiedHourlyWeather, 'localDt'> = {
    temperature: 7.7, //for women, alleged by Outside
    humidity: 40, //or less
    clouds: 40, //spitballing
    uvi: 0, // i mean ideally
    rain: 0, // i'd rather not
    snow: 0, // hell no
};

interface scoredConditions {
    hourlyConditions: SimplifiedHourlyWeather;
    score: number;
}

export async function getWeatherForecast(): Promise<SimplifiedHourlyWeather[]> {
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
        }
    }

    return hourlyConditions;
}

export function findBestTime(
    hourlyConditions: SimplifiedHourlyWeather[],
): scoredConditions {
    const hourScores: scoredConditions[] = hourlyConditions.map((x) => ({
        hourlyConditions: x,
        score: scoreEachHour(x),
    }));
    const bestScore = hourScores.reduce((best, test) =>
        best.score > test.score ? best : test,
    );
    return bestScore;
}

export function scoreEachHour(conditions: SimplifiedHourlyWeather): number {
    const { temperature, humidity, clouds, uvi, rain, snow } = conditions;
    //rule out downright bad conditions
    if (
        (snow && snow > 1) ||
        (rain && rain > 5) ||
        temperature < -18 ||
        temperature > 33 ||
        uvi > 7 ||
        humidity > 90
    ) {
        return 0;
    }

    const score =
        scoreTemperature(temperature) + scoreHumidity(humidity) + scoreUvi(uvi);

    return score;
}

function scoreTemperature(temperature: number): number {
    return (
        (1 / Math.abs(temperature - idealRunningConditions.temperature)) * 1000
    );
}

function scoreHumidity(humidity: number): number {
    if (humidity < 40) {
        return 100;
    }
    return 100 - humidity;
}

function scoreUvi(uvi: number): number {
    return (10 - uvi) * 10;
}

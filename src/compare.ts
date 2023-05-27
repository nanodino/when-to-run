import { SimplifiedHourlyWeather } from './schemas';

const idealRunningConditions: Omit<SimplifiedHourlyWeather, 'localDt'> = {
    temperature: 7.7, //for women, alleged by Outside
    humidity: 40, //or less
    clouds: 40, //spitballing
    uvi: 0, // or less, top end of the moderate risk category
    rain: 0, // i'd rather not
    snow: 0, // hell no
};

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
    return 10 - uvi;
}

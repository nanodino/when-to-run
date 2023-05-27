//I don't do types anymore
import { z } from 'zod';

// type SimplifiedHourlyWeather = Pick<
//     HourlyConditions,
//     'temp' | 'humidity' | 'clouds' | 'uvi' | 'visibility' | 'rain' | 'snow'
// > & 'hour';

const simplifiedHourlyWeatherSchema = z.object({
    localDt: z.string().datetime(),
    temperature: z.number(),
    humidity: z.number().nonnegative().max(100),
    clouds: z.number().nonnegative().max(100),
    uvi: z.number(),
    visibility: z.number(), //meters
    rain: z.number().optional(),
    snow: z.number().optional(),
});

export type SimplifiedHourlyWeather = z.infer<
    typeof simplifiedHourlyWeatherSchema
>;

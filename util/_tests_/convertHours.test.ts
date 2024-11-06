import { convertHours } from '../convertHours'
import { HourForecast } from '@/types/HourForecast'

describe('convertHours unit test', () => {
	it('should convert time_epoch to AM/PM format', () => {
		const mockData: HourForecast[] = [
			{
				time_epoch: 1684200000, // timestamp
				time: '2023-06-15 13:20',
				temp_c: 25,
				temp_f: 77,
				is_day: 1,
				condition: { text: 'Sunny', icon: '_', code: 1000 },
				wind_mph: 10,
				wind_kph: 16,
				wind_degree: 180,
				wind_dir: 'S',
				pressure_mb: 1015,
				pressure_in: 30.0,
				precip_mm: 0,
				precip_in: 0,
				snow_cm: 0,
				humidity: 50,
				cloud: 0,
				feelslike_c: 25,
				feelslike_f: 77,
				windchill_c: 25,
				windchill_f: 77,
				heatindex_c: 25,
				heatindex_f: 77,
				dewpoint_c: 10,
				dewpoint_f: 50,
				will_it_rain: 0,
				chance_of_rain: 0,
				will_it_snow: 0,
				chance_of_snow: 0,
				vis_km: 10,
				vis_miles: 6,
				gust_mph: 15,
				gust_kph: 24,
				uv: 5,
			},
		]

		// using spread operator in actual code so do same here for test
		const expectedOutput: HourForecast[] = [
			{
				...mockData[0],
				time_epoch: '1:20 PM', // expected AM/PM format
			},
		]

		// assertions
		expect(convertHours(mockData)).toEqual(expectedOutput)
	})
})

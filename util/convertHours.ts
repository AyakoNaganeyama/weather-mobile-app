import { HourForecast } from '@/types/HourForecast'

// this is helper for converting to am and pm format
export function convertHours(
	forecasts: HourForecast[],
	tz_id: string
): HourForecast[] {
	const convertEpochTo12Hour = (epoch: number, tz_id: string): string => {
		const date = new Date(epoch * 1000) // convert from seconds to milliseconds

		// Use `toLocaleTimeString` to account for the timezone
		const options: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true, // AM/PM format
			timeZone: tz_id, // timezone based on provided tz_id
		}

		// Convert epoch time to the correct timezone and format
		return date.toLocaleTimeString(undefined, options)
	}

	// Return a new array with only `time_epoch` converted
	return forecasts.map((forecast) => ({
		...forecast, // Keep all other properties the same
		time_epoch: convertEpochTo12Hour(forecast.time_epoch as number, tz_id), // Convert `time_epoch` to 12-hour AM/PM format
	}))
}

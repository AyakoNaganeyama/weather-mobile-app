import { HourForecast } from '@/app/types/HourForecast'

// this is helper for converting to am and pm format
export function convertHours(forecasts: HourForecast[]): HourForecast[] {
	const convertEpochTo12Hour = (epoch: number): string => {
		const date = new Date(epoch * 1000) // Convert from seconds to milliseconds
		let hours = date.getHours() // Get the hour in 24-hour format
		const minutes = date.getMinutes() // Get the minutes
		const ampm = hours >= 12 ? 'PM' : 'AM' // Determine AM or PM
		hours = hours % 12 // Convert to 12-hour format
		hours = hours ? hours : 12 // If hours is 0 (midnight), make it 12

		// Format minutes with leading zero if needed
		const minutesStr = minutes < 10 ? '0' + minutes : minutes

		return `${hours}:${minutesStr} ${ampm}`
	}

	// Return a new array with only `time_epoch` converted
	return forecasts.map((forecast) => ({
		...forecast, // Keep all other properties the same
		time_epoch: convertEpochTo12Hour(forecast.time_epoch as number), // Convert `time_epoch` to 12-hour AM/PM format
	}))
}

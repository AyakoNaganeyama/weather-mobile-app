// this function is to display background image depending on current weather condition
export function useGetImage() {
	const getImage = (conditionText: string, isDay: number) => {
		// lowercase the condition
		const lowerCaseCondition = conditionText.toLowerCase()

		// Choose images based on the condition and time of day

		if (isDay) {
			if (
				lowerCaseCondition.includes('sunny') ||
				lowerCaseCondition.includes('clear')
			) {
				return require('../assets/images/weatherBackground/noon-sunny.jpg') // Daytime sunny image
			} else if (
				lowerCaseCondition.includes('cloudy') ||
				lowerCaseCondition.includes('overcast')
			) {
				return require('../assets/images/weatherBackground/noon-cloudy.jpg') // Noon cloudy
			} else if (
				lowerCaseCondition.includes('rain') ||
				lowerCaseCondition.includes('drizzle')
			) {
				return require('../assets/images/weatherBackground/noon-rain.jpg') // Noon rain
			} else {
				return require('../assets/images/weatherBackground/noon-sunny.jpg') // Default
			}
		} else {
			if (
				lowerCaseCondition.includes('sunny') ||
				lowerCaseCondition.includes('clear')
			) {
				return require('../assets/images/weatherBackground/night-sunny.jpg') // night sunny
			} else if (
				lowerCaseCondition.includes('cloudy') ||
				lowerCaseCondition.includes('overcast')
			) {
				return require('../assets/images/weatherBackground/night-cloudy.jpg') // Night cloudy
			} else if (
				lowerCaseCondition.includes('rain') ||
				lowerCaseCondition.includes('drizzle')
			) {
				return require('../assets/images/weatherBackground/night-rain.jpg') // Night rain
			} else {
				return require('../assets/images/weatherBackground/night-sunny.jpg') //default
			}
		}
	}
	return { getImage }
}

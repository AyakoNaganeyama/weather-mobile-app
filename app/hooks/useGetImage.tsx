import { View, Text } from 'react-native'
import React from 'react'
// this function is to display background image depending on current weather condition
const useGetImage = () => {
	const getImage = (conditionText: string, isDay: number) => {
		// lowercase the condition
		const lowerCaseCondition = conditionText.toLowerCase()

		// Choose images based on the condition and time of day

		if (isDay) {
			if (
				lowerCaseCondition.includes('sunny') ||
				lowerCaseCondition.includes('clear')
			) {
				return require('../img/noon-sunny.jpg') // Daytime sunny image
			} else if (
				lowerCaseCondition.includes('cloudy') ||
				lowerCaseCondition.includes('overcast')
			) {
				return require('../img/noon-cloudy.jpg') // Noon cloudy
			} else if (
				lowerCaseCondition.includes('rain') ||
				lowerCaseCondition.includes('drizzle')
			) {
				return require('../img/noon-rain.jpg') // Noon rain
			} else {
				return require('../img/noon-sunny.jpg') // Default
			}
		} else {
			if (
				lowerCaseCondition.includes('sunny') ||
				lowerCaseCondition.includes('clear')
			) {
				return require('../img/night-sunny.jpg') // night sunny
			} else if (
				lowerCaseCondition.includes('cloudy') ||
				lowerCaseCondition.includes('overcast')
			) {
				return require('../img/night-cloudy.jpg') // Night cloudy
			} else if (
				lowerCaseCondition.includes('rain') ||
				lowerCaseCondition.includes('drizzle')
			) {
				return require('../img/night-rain.jpg') // Night rain
			} else {
				return require('../img/night-sunny.jpg') //default
			}
		}
	}
	return { getImage }
}

export default useGetImage

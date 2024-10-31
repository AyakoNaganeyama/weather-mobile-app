import React from 'react'
import { useState, useEffect } from 'react'
import useCityStore from '../stores/cityStore'
import { Link } from 'expo-router'

import { StatusBar } from 'expo-status-bar'
import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Share,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { addDoc, collection, getDocs, where, query } from 'firebase/firestore'
import { Firestore } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import useGetImage from '../hooks/useGetImage'
import { WeatherData } from '../types/forcastType'
import useBooleanStore from '../stores/isSearched'
import useIsExist from '../stores/isExist'
import useHandleCityList from './useHandleCityList'
import useAucklandWeather from '../stores/aucklandImageStore'
import { HourForecast } from '../types/HourForecast'

// this contains inital search (current location weather ) and search for other cities functions

const useHandleSearch = () => {
	const { storedCity, setStoredCity, clearStoredCity } = useCityStore()
	const [location, setLocation] = useState(null)
	const [currentCity, setCurrentCity] = useState<WeatherData | null>(null)
	const [searchedCity, setSearchedCity] = useState<WeatherData | null>(null)

	const [errorMsg, setErrorMsg] = useState(null)
	const [cityText, setCityText] = useState('')
	const [todayCast, setTodayCast] = useState<HourForecast[]>([])
	const [formatted, setFormatted] = useState([])
	const [todayCast2, setTodayCast2] = useState([])
	const [isS, setIsS] = useState(false)
	const { isActive, setTrue, setFalse } = useBooleanStore() // when city is added to fire store, change global state to false for not showing <Searched>.tsx in explore.tsx
	const { isExist, setTrue2, setFalse2 } = useIsExist() // for hiding and showing add city button
	const { handleDelete, cities, fetchCityList, addSearchedCityToList } =
		useHandleCityList()

	const { storedAuckland, setStoredAuckland, clearStoredAuckland } =
		useAucklandWeather() // this might be used for explore.tsx to show current weather background image but currently blakc background

	// as soon as user open the app useEffect this function in index.tsx
	const initialSearch = async () => {
		// Ask for permission to access location
		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied')
			return
		}

		// Get the current location
		let location = await Location.getCurrentPositionAsync({})
		setLocation(location)

		let reverseGeocode = await Location.reverseGeocodeAsync({
			latitude: location.coords.latitude, // Fixed the variable name
			longitude: location.coords.longitude,
		})
		// search by city name, could have been by lon and lat
		if (reverseGeocode.length > 0) {
			// Set the city name
			let cityName = reverseGeocode[0].city
			// const today = new Date().toISOString().split('T')[0];

			async function getWeather() {
				const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API}&q=${cityName}&days=3`

				const options = {
					method: 'GET',
				}

				try {
					const response = await fetch(url, options)
					const result = await response.json()
					addSearchedCityToList(result)
					setCurrentCity(result)
					setStoredAuckland(result)
					console.log('Current', result)

					//for 7 day forcast

					const currentEpoch = Math.floor(Date.now() / 1000) // Date.now()
					const forecastHours = result.forecast.forecastday[0].hour // 24 hours forcast

					let forcast24 = []

					// Define a range for comparison (e.g., within the same hour)
					let index = 0

					const hourInSeconds = 3600 // 1 hour in seconds

					for (let i = 0; i < forecastHours.length; i++) {
						let hour = forecastHours[i]

						// Check if the hour time is within a 1-hour range of the current time
						if (Math.abs(hour.time_epoch - currentEpoch) <= hourInSeconds) {
							console.log('Matching hour found:', hour)

							index = i // Store the index of the matched hour
							break // Break out of the loop once a match is found
						}
					}

					console.log('Matched hour index:', index)

					for (let j = index; j < forecastHours.length; j++) {
						forcast24.push(forecastHours[j])
					}
					// how many empty array is left
					let tomorrowForcast = 24 - forcast24.length
					console.log(forcast24.length, tomorrowForcast)
					// fill the rest of empty array with tomorrow's forcast
					if (tomorrowForcast > 0) {
						for (let i = 0; i < tomorrowForcast; i++) {
							forcast24.push(result.forecast.forecastday[1].hour[i])
						}
					}

					forcast24.forEach((hour) => {
						console.log(`Time: ${hour.time}, Temperature: ${hour.temp_c}°C`)
					})

					let formatted = convertHours(forcast24)

					setTodayCast(formatted)

					console.log(result)
				} catch (error) {
					console.error(error)
				}
			}

			getWeather()
		}
	}

	// this is helper for converting to am and pm format
	const convertHours = (forecasts: HourForecast[]): HourForecast[] => {
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

	// connected to search button in explore.tsx
	const handleSearch = async () => {
		console.log('city text', cityText)
		const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API}&q=${cityText}&days=3` // Change to forecast API with 3 days (they only have 3 days anyway)
		const options = {
			method: 'GET',
		}

		try {
			const response = await fetch(url, options)
			if (response.ok) {
				const result = await response.json()
				console.log('Search result: ', result)
				setSearchedCity(result)
				checkIfCityAlreadyExists(result)
				setFalse()
			} else {
				console.log('Error: ', response.status)
			}
		} catch (error) {
			console.error('Fetch error: ', error)
		}
	}

	// This is used in handleSearch function to check if city already exists in firebase

	const checkIfCityAlreadyExists = async (result: WeatherData) => {
		try {
			const lat = result?.location.lat
			const lon = result?.location.lon

			const weatherDataRef = collection(firestore, 'weatherData2')

			// Create a query with multiple where conditions
			const q = query(
				weatherDataRef,
				where('location.lat', '==', lat),
				where('location.lon', '==', lon)
			)

			// Execute the query and get the results
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				setFalse2()
				console.log(isExist)
			} else {
				setTrue2()
				console.log(isExist)
			}
		} catch (err) {
			console.log(err)
		}
	}

	return {
		initialSearch,

		currentCity,
		cityText,
		todayCast,
		errorMsg,
		handleSearch,
		setCityText, // So users can type the city name

		searchedCity,
		todayCast2,
		setSearchedCity,
		formatted,
	}
}

export default useHandleSearch

import { useState } from 'react'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import { WeatherData } from '../types/forcastType'
import useBooleanStore from '../stores/isSearched'
import useCityStore from '../stores/cityStore'
import useIsExist from '../stores/isExist'

// those functions are CRUD for firestore (no update because dont need )
export function useHandleCityList() {
	const [cities, setCities] = useState<WeatherData[]>([])
	const { isExist, setTrue2, setFalse2 } = useIsExist() // for hiding and showing add city button
	const { storedCity, setStoredCity, clearStoredCity } = useCityStore() // for rendering city list in explore.tsx
	const { isActive, setTrue, setFalse } = useBooleanStore() //to show or not show <Searched>.tsx (searched city) in explore.tsx

	//CRUD for firebase (don't think need update so did not add update)

	const handleDelete = async (city: string, country: string) => {
		const q = query(
			collection(firestore, 'weatherData2'),
			where('location.name', '==', city),
			where('location.country', '==', country)
		)

		const querySnapshot = await getDocs(q)
		querySnapshot.forEach(async (document) => {
			await deleteDoc(doc(firestore, 'weatherData2', document.id))
			console.log(`Document with ID ${document.id} deleted`)
			const weatherDataRef = collection(firestore, 'weatherData2')
			const querySnapshot = await getDocs(weatherDataRef)

			// Convert `querySnapshot` to an array of objects, ensuring it's typed correctly
			const storedCities: WeatherData[] = querySnapshot.docs.map((doc) => ({
				...doc.data(),
			})) as WeatherData[]

			// Update state with the fetched cities
			setCities(storedCities)
		})
	}
	const fetchCityList = async () => {
		try {
			// Fetching data from Firebase Firestore
			const weatherDataRef = collection(firestore, 'weatherData2')
			const querySnapshot = await getDocs(weatherDataRef)

			// Convert `querySnapshot` to an array of objects, ensuring it's typed correctly
			const storedCities: WeatherData[] = (await querySnapshot.docs.map(
				(doc) => ({
					...doc.data(),
				})
			)) as WeatherData[]

			// Update state with the fetched cities
			setCities(storedCities)
			console.log('Stored cities from Firestore:', storedCities)
			if (storedCities) return true
		} catch (error) {
			console.error('Failed to load cities from Firestore:', error)
			return false
		}
	}

	const addSearchedCityToList = async (data: WeatherData) => {
		try {
			if (data) {
				const cityName = data?.location.name
				const countryName = data?.location.country

				const weatherDataRef = collection(firestore, 'weatherData2')

				// check if the city searched is already in firestore
				const q = query(
					weatherDataRef,
					where('location.name', '==', cityName),
					where('location.country', '==', countryName)
				)

				const querySnapshot = await getDocs(q)

				// if city does not exist in firestore already add

				if (querySnapshot.empty) {
					// Store the weather and forecast data into Firestore
					const weatherData = {
						location: {
							name: data?.location.name,
							region: data?.location.region,
							country: data?.location.country,
							lat: data?.location.lat,
							lon: data?.location.lon,
							tz_id: data?.location.tz_id,
							localtime_epoch: data?.location.localtime_epoch,
							localtime: data?.location.localtime,
						},
						current: {
							last_updated_epoch: data?.current?.last_updated_epoch,
							last_updated: data?.current?.last_updated,
							temp_c: data?.current?.temp_c,
							temp_f: data?.current?.temp_f,
							is_day: data?.current?.is_day,
							wind_mph: data?.current?.wind_mph,
							wind_kph: data?.current?.wind_kph,
							wind_degree: data?.current?.wind_degree,
							wind_dir: data?.current?.wind_dir,
							pressure_mb: data?.current?.pressure_mb,
							pressure_in: data?.current?.pressure_in,
							precip_mm: data?.current?.precip_mm,
							precip_in: data?.current?.precip_in,
							humidity: data?.current?.humidity,
							cloud: data?.current?.cloud,
							feelslike_c: data?.current?.feelslike_c,
							feelslike_f: data?.current?.feelslike_f,
							windchill_c: data?.current?.windchill_c,
							windchill_f: data?.current?.windchill_f,
							heatindex_c: data?.current?.heatindex_c,
							heatindex_f: data?.current?.heatindex_f,
							dewpoint_c: data?.current?.dewpoint_c,
							dewpoint_f: data?.current?.dewpoint_f,
							vis_km: data?.current?.vis_km,
							vis_miles: data?.current?.vis_miles,
							uv: data?.current?.uv,
							gust_mph: data?.current?.gust_mph,
							gust_kph: data?.current?.gust_kph,
						},
						forecast: data?.forecast,
					}

					const docRef = await addDoc(
						collection(firestore, 'weatherData2'),
						weatherData
					)
					console.log('Document written with ID: ', docRef.id)

					// Reset searchedCity after the city is added

					setStoredCity(data)

					//global state for showing the Searched page or not in exlore.tsx
					setTrue()
				} else {
					console.log('City already exists')
				}
			}
		} catch (e) {
			console.log(e)
		}
	}

	return { handleDelete, cities, fetchCityList, addSearchedCityToList }
}

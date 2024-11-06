import { create } from 'zustand'

// this store may be used for displaying current auckland weather background image in explore.tsx
interface CityState {
	storedAuckland: {
		location: {
			name: string
			region: string
			country: string
			lat: number
			lon: number
			tz_id: string
			localtime_epoch: number
			localtime: string
		}
		current: {
			temp_c: number
			temp_f: number
			condition: {
				text: string
				icon: string
			}
			wind_kph: number
			wind_mph: number
			humidity: number
			feelslike_c: number
			feelslike_f: number
			vis_km: number
			vis_miles: number
			gust_kph: number
			gust_mph: number
			uv: number
		}
		forecast: {
			forecastday: Array<{
				date: string
				day: {
					maxtemp_c: number
					maxtemp_f: number
					mintemp_c: number
					mintemp_f: number
					avgtemp_c: number
					avgtemp_f: number
					daily_will_it_rain: number
					daily_chance_of_rain: number
				}
				hour: Array<{
					time_epoch: number
					temp_c: number
					temp_f: number
					condition: {
						text: string
						icon: string
					}
					wind_kph: number
					wind_mph: number
				}>
			}>
		}
	} | null
	setStoredAuckland: (city: {
		location: {
			name: string
			region: string
			country: string
			lat: number
			lon: number
			tz_id: string
			localtime_epoch: number
			localtime: string
		}
		current: {
			temp_c: number
			temp_f: number
			condition: {
				text: string
				icon: string
			}
			wind_kph: number
			wind_mph: number
			humidity: number
			feelslike_c: number
			feelslike_f: number
			vis_km: number
			vis_miles: number
			gust_kph: number
			gust_mph: number
			uv: number
		}
		forecast: {
			forecastday: Array<{
				date: string
				day: {
					maxtemp_c: number
					maxtemp_f: number
					mintemp_c: number
					mintemp_f: number
					avgtemp_c: number
					avgtemp_f: number
					daily_will_it_rain: number
					daily_chance_of_rain: number
				}
				hour: Array<{
					time_epoch: number
					temp_c: number
					temp_f: number
					condition: {
						text: string
						icon: string
					}
					wind_kph: number
					wind_mph: number
				}>
			}>
		}
	}) => void
	clearStoredAuckland: () => void
}

// Create the Zustand store for city data
const useAucklandWeather = create<CityState>((set) => ({
	storedAuckland: null, // Initial state
	setStoredAuckland: (city) => set({ storedAuckland: city }), // Set city data
	clearStoredAuckland: () => set({ storedAuckland: null }), // Clear city data
}))

export default useAucklandWeather

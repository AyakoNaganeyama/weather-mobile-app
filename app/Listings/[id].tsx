import {
	View,
	Text,
	ScrollView,
	ImageBackground,
	StyleSheet,
	Button,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useGetImage from '../hooks/useGetImage'
import useShare from '../hooks/useShare'
import { useFrontEndLogic } from '../hooks/useFrontEndLogic'
import { WeatherData } from '../types/forcastType'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Feather } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import { HourForecast } from '../types/HourForecast'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { covertToDay } from '@/util/convertToDay'
import { convertHours } from '@/util/convertHours'

// this page is shown when user click city from city list by passing lon and lat from explore.tsx

const Page = () => {
	const { id } = useLocalSearchParams()
	const { getImage } = useGetImage()
	const { onShare } = useShare()

	const [city, setCity] = useState<WeatherData | null>(null)
	const [todayCast, setTodayCast] = useState<HourForecast[]>([])
	const [errorMsg, setErrorMsg] = useState(null)
	const {
		checkUV,
		checkVisibility,
		checkFeelsLike,
		checkHumidity,
		checkWind,
		checkCloud,
	} = useFrontEndLogic()

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log('city id with lon and rat', id)
				const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API}&q=${id}&days=3` // 3-day forecast API
				const options = {
					method: 'GET',
				}

				const response = await fetch(url, options)
				if (response.ok) {
					const result = await response.json()
					setCity(result)

					const currentEpoch = Math.floor(Date.now() / 1000) // Current time in seconds
					const forecastHours = result.forecast.forecastday[0].hour

					let forcast24 = []
					let index = 0
					const hourInSeconds = 3600 // 1 hour in seconds

					for (let i = 0; i < forecastHours.length; i++) {
						let hour = forecastHours[i]
						if (Math.abs(hour.time_epoch - currentEpoch) <= hourInSeconds) {
							index = i
							break
						}
					}

					for (let j = index; j < forecastHours.length; j++) {
						forcast24.push(forecastHours[j])
					}

					let tomorrowForcast = 24 - forcast24.length
					if (tomorrowForcast > 0) {
						for (let i = 0; i < tomorrowForcast; i++) {
							forcast24.push(result.forecast.forecastday[1].hour[i])
						}
					}

					setTodayCast(convertHours(forcast24))
				} else {
					console.log('Failed to fetch weather data. Please try again later.')
				}
			} catch (error) {
				console.log('Fetch error: ', error)
			}
		}

		fetchData()
	}, [id])

	// preload image here so faster once called in view
	const backGroundImageSrc = getImage(
		city?.current?.condition?.text || 'Unknown',
		city?.current?.is_day ?? 0
	)

	return (
		<>
			{city && (
				<ScrollView>
					<ImageBackground
						source={backGroundImageSrc}
						style={styles.backgroundImage}
					>
						<View style={{ marginVertical: 40 }}>
							<TouchableOpacity
								onPress={() => onShare(city)}
								style={{
									backgroundColor: 'rgba(0,0,0, 0.2)',

									padding: 10,
									borderRadius: 15,
									marginHorizontal: 20,
									marginBottom: 20,
									width: 50,
									height: 50,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Entypo name='share-alternative' size={24} color='white' />
							</TouchableOpacity>

							<View>
								{/* Current Weather Display */}
								<View
									style={{
										backgroundColor: 'rgba(0,0,0, 0.2)',

										padding: 10,
										borderRadius: 15,
										marginHorizontal: 20,
										marginBottom: 20,
									}}
								>
									<View style={styles.main}>
										<Text style={styles.heading}>{city.location.name}</Text>
										<View style={styles.temp}>
											<Text style={styles.tempShown}>
												{Math.round(city.current.temp_c)}°
											</Text>

											<Text style={styles.currentCond}>
												{city.current.condition.text}
											</Text>

											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													marginTop: 5,
												}}
											>
												<View style={{ marginRight: 5 }}>
													<Text style={styles.currentCond}>
														L:
														{Math.round(
															city.forecast.forecastday[0].day.mintemp_c
														)}
														°
													</Text>
												</View>
												<Text style={styles.currentCond}>
													H:
													{Math.round(
														city.forecast.forecastday[0].day.maxtemp_c
													)}
													°
												</Text>
											</View>
										</View>
									</View>
								</View>
								{/* 24 Hour Forecast ScrollView */}
								<View
									style={{
										backgroundColor: 'rgba(0,0,0, 0.2)',
										padding: 10,
										borderRadius: 15,
										marginVertical: 20,
										marginHorizontal: 20,
									}}
								>
									<View
										style={{
											borderBottomWidth: 1,

											borderBottomColor: 'gray',
											paddingBottom: 10,
											paddingTop: 10,
											marginHorizontal: 16,
										}}
									>
										<Text style={styles.text}>24 HOUR FORCAST</Text>
									</View>
									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										contentContainerStyle={{
											alignContent: 'center',
											gap: 20,
											paddingHorizontal: 16,
										}}
									>
										{todayCast.length > 0 ? (
											todayCast.map((i, ind) =>
												ind === 0 ? (
													<TouchableOpacity key={ind} style={styles.info}>
														<Text style={{ color: 'white' }}>Now</Text>
														<Image
															source={{ uri: `https:${i.condition.icon}` }}
															style={{ width: 50, height: 50 }} // Adjust size as needed
														/>
														<Text style={{ color: 'white' }}>
															{Math.round(i.temp_c)}°
														</Text>
													</TouchableOpacity>
												) : (
													<TouchableOpacity key={ind} style={styles.info}>
														<Text style={{ color: 'white' }}>
															{i.time_epoch}
														</Text>
														<Image
															source={{ uri: `https:${i.condition.icon}` }}
															style={{ width: 50, height: 50 }} // Adjust size as needed
														/>
														<Text style={{ color: 'white' }}>
															{Math.round(i.temp_c)}°
														</Text>
													</TouchableOpacity>
												)
											)
										) : (
											<Text style={styles.text}>No forecast available.</Text>
										)}
									</ScrollView>
								</View>

								{/* 3 Day Forecast ScrollView */}
								<View
									style={{
										backgroundColor: 'rgba(0,0,0, 0.2)',
										padding: 10,
										borderRadius: 15,
										marginVertical: 20,
										marginHorizontal: 20,
									}}
								>
									<View
										style={{
											borderBottomWidth: 1,

											borderBottomColor: 'gray',
											paddingBottom: 10,
											paddingTop: 10,
											marginHorizontal: 16,
										}}
									>
										<Text style={styles.text}>3-DAY FORCAST</Text>
									</View>

									<ScrollView
										showsHorizontalScrollIndicator={false}
										contentContainerStyle={{
											alignContent: 'center',
											gap: 20,
											paddingHorizontal: 16,
										}}
									>
										{city.forecast.forecastday.map((item, index) => (
											<TouchableOpacity
												key={index}
												style={{
													borderBottomWidth:
														index !== city.forecast.forecastday.length - 1
															? 1
															: 0, // Adding border except for the last item
													borderBottomColor: 'gray',
													paddingBottom: 10,
													paddingTop: 10,
													flexDirection: 'row',

													alignItems: 'center',
												}}
											>
												{index === 0 ? (
													<>
														<View
															style={{
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View style={{ width: '40%' }}>
																<Text style={styles.threeDay}>Today</Text>
															</View>

															<Image
																source={{
																	uri: `https:${item.day.condition.icon}`,
																}}
																style={{ width: '20%', height: 50 }}
															/>
														</View>

														<View
															style={{ flexDirection: 'row', width: '40%' }}
														>
															<View
																style={{
																	marginRight: 10,
																	flexDirection: 'row',
																}}
															>
																<FontAwesome6
																	name='temperature-arrow-up'
																	size={24}
																	color='white'
																/>
																<Text style={styles.threeDay}>
																	{item.day.maxtemp_c}
																</Text>
															</View>

															<FontAwesome6
																name='temperature-arrow-down'
																size={24}
																color='white'
															/>
															<Text style={styles.threeDay}>
																{item.day.mintemp_c}
															</Text>
														</View>
													</>
												) : (
													<>
														<View
															style={{
																flexDirection: 'row',
																alignItems: 'center',
																flex: 1,
															}}
														>
															<View style={{ width: '40%' }}>
																<Text style={styles.threeDay}>
																	{covertToDay(item.date)}
																</Text>
															</View>
															<Image
																source={{
																	uri: `https:${item.day.condition.icon}`,
																}}
																style={{ width: '20%', height: 50 }}
															/>
														</View>

														<View
															style={{ flexDirection: 'row', width: '40%' }}
														>
															<View
																style={{
																	marginRight: 10,
																	flexDirection: 'row',
																}}
															>
																<FontAwesome6
																	name='temperature-arrow-up'
																	size={24}
																	color='white'
																/>
																<Text style={styles.threeDay}>
																	{item.day.maxtemp_c}
																</Text>
															</View>
															<FontAwesome6
																name='temperature-arrow-down'
																size={24}
																color='white'
															/>
															<Text style={styles.threeDay}>
																{item.day.mintemp_c}
															</Text>
														</View>
													</>
												)}
											</TouchableOpacity>
										))}
									</ScrollView>
								</View>

								{/* Additional Weather Info */}
							</View>

							{/**************************row1**********************************************/}
							<View style={{ marginHorizontal: 20, marginVertical: 20 }}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										height: 200,
									}}
								>
									{/***********************UV****************************************************/}
									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<Feather name='sun' style={styles.text} />
												<Text style={styles.text}>UV index</Text>
											</View>
										</View>

										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{city.current.uv}
											</Text>
											<Text style={styles.threeDay}>
												{checkUV(city.current.uv)}
											</Text>
										</View>
									</TouchableOpacity>
									{/***********************Humidity****************************************************/}
									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<MaterialCommunityIcons
													name='air-humidifier'
													style={styles.text}
												/>
												<Text style={styles.text}>Humidity</Text>
											</View>
										</View>
										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{city.current.humidity}%
											</Text>
											<Text style={styles.threeDay}>
												{checkHumidity(city.current.humidity)}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

							{/**************row2****************/}
							<View style={{ marginHorizontal: 20, marginVertical: 20 }}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										height: 200,
									}}
								>
									{/******************wind*********************************/}
									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<Feather name='wind' style={styles.text} />
												<Text style={styles.text}>Wind</Text>
											</View>
										</View>
										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{city.current.wind_kph}km/h
											</Text>
											<Text style={styles.threeDay}>
												{checkWind(city.current.wind_kph)}
											</Text>
										</View>
									</TouchableOpacity>

									{/*******************Feels like****************************************/}

									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<FontAwesome6
													name='temperature-empty'
													style={styles.text}
												/>
												<Text style={styles.text}>Feels like</Text>
											</View>
										</View>
										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{Math.round(city.current.feelslike_f)}°
											</Text>
											<Text style={styles.threeDay}>
												{checkFeelsLike(city.current.feelslike_c)}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>

							{/**************row3****************/}
							<View style={{ marginHorizontal: 20, marginVertical: 20 }}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										height: 200,
									}}
								>
									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<AntDesign name='cloudo' style={styles.text} />
												<Text style={styles.text}>Cloud</Text>
											</View>
										</View>
										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{city.current.cloud}%
											</Text>
											<Text style={styles.threeDay}>
												{checkCloud(city.current.cloud)}
											</Text>
										</View>
									</TouchableOpacity>

									<TouchableOpacity
										style={{
											backgroundColor: 'rgba(0,0,0, 0.2)',

											padding: 10,
											borderRadius: 15,
											width: '48%',
											height: '100%',
											flexDirection: 'column',
										}}
									>
										<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
											<View
												style={{
													height: '30%',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<AntDesign name='eyeo' style={styles.text} />
												<Text style={styles.text}>Visibility</Text>
											</View>
										</View>
										<View style={{ height: '50%' }}>
											<Text
												style={{
													color: 'white',

													fontSize: 40,
												}}
											>
												{city.current.vis_km}km
											</Text>
											<Text style={styles.threeDay}>
												{checkVisibility(city.current.vis_km)}
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
							<View style={{ alignItems: 'center' }}></View>
						</View>
					</ImageBackground>
				</ScrollView>
			)}
			{errorMsg && <Text>{errorMsg}</Text>}
		</>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	main: {
		marginTop: 50,
		marginBottom: 50,
	},
	threeDay: {
		color: '#fff',
		fontSize: 18,
	},
	currentCond: {
		color: '#fff',
		fontSize: 30,
	},

	backgroundImage: {
		width: '100%',
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	heading: {
		color: '#fff',
		fontSize: 60,
		textAlign: 'center',
	},
	tempShown: {
		fontSize: 100,
		fontWeight: 800,
		color: '#fff',
	},
	temp: {
		alignItems: 'center',
		marginBottom: 30,
	},
	text: {
		color: 'rgba(255, 255, 255, 0.7)',
		fontSize: 15,
		paddingBottom: 20,
	},
	more: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 32,
		marginTop: 32,
	},
	con2: {
		paddingTop: 16,
		paddingBottom: 100,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		flex: 1,
	},
	inputHead: {
		flexDirection: 'row',
		marginTop: 30,
		justifyContent: 'space-between',
		height: 50,
		marginBottom: 30,
	},
	input: {
		width: '70%',
		padding: 15,
		borderWidth: 2,
		borderColor: '#51606b',
		borderRadius: 10,

		fontWeight: 'bold',
	},
	AddButton: {
		backgroundColor: '#6c7cac',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonDisabled: {
		backgroundColor: '#8e979e',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	infoText: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 5,
	},
	container2: {
		padding: 10,
	},
	searchContainer2: {
		flexDirection: 'row', // Align input and button in a row
		alignItems: 'center',
	},
	input2: {
		flex: 1,
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		paddingLeft: 10,
		borderRadius: 5,
	},
	searchButton2: {
		backgroundColor: '#007AFF',
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginLeft: 10,
		borderRadius: 5,
	},
	buttonText2: {
		color: 'white',
		fontSize: 16,
	},
	info: {
		width: Dimensions.get('screen').width / 5,

		padding: 10,
		borderRadius: 15,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
})

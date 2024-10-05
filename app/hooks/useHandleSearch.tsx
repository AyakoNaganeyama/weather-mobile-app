import React from "react";
import { useState, useEffect } from "react";
import useCityStore from "../stores/cityStore";
import { Link } from "expo-router";

import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { addDoc, collection, getDocs, where, query } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import { WeatherData } from "../types/forcastType";
import useBooleanStore from "../stores/isSearched";

const useHandleSearch = () => {
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();
  const [location, setLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState<WeatherData | null>(null);
  const [searchedCity, setSearchedCity] = useState<WeatherData | null>(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [cityText, setCityText] = useState("");
  const [todayCast, setTodayCast] = useState([]);
  const [todayCast2, setTodayCast2] = useState([]);
  const [isS, setIsS] = useState(false);
  const { isActive, setTrue, setFalse } = useBooleanStore();

  const initialSearch = async () => {
    // Ask for permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    // Get the current location
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude, // Fixed the variable name
      longitude: location.coords.longitude,
    });

    if (reverseGeocode.length > 0) {
      // Set the city name
      let cityName = reverseGeocode[0].city;
      // const today = new Date().toISOString().split('T')[0];

      async function getWeather() {
        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`;

        // `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityName}`;
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "b5ab53305emsh4d78561239fb906p1da757jsne5442cea8267",
            "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
          },
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();
          setCurrentCity(result);
          console.log("Current", result);

          //for 7 day forcast

          const currentEpoch = Math.floor(Date.now() / 1000); // Date.now()
          const forecastHours = result.forecast.forecastday[0].hour; // 24 hours forcast

          let forcast24 = [];

          // Define a range for comparison (e.g., within the same hour)
          let index = 0;

          const hourInSeconds = 3600; // 1 hour in seconds

          for (let i = 0; i < forecastHours.length; i++) {
            let hour = forecastHours[i];

            // Check if the hour time is within a 1-hour range of the current time
            if (Math.abs(hour.time_epoch - currentEpoch) <= hourInSeconds) {
              console.log("Matching hour found:", hour);

              index = i; // Store the index of the matched hour
              break; // Break out of the loop once a match is found
            }
          }

          console.log("Matched hour index:", index);

          for (let j = index; j < forecastHours.length; j++) {
            forcast24.push(forecastHours[j]);
          }

          let tomorrowForcast = 24 - forcast24.length;
          console.log(forcast24.length, tomorrowForcast);

          if (tomorrowForcast > 0) {
            for (let i = 0; i < tomorrowForcast; i++) {
              forcast24.push(result.forecast.forecastday[1].hour[i]);
            }
          }

          forcast24.forEach((hour) => {
            console.log(`Time: ${hour.time}, Temperature: ${hour.temp_c}°C`);
          });
          setTodayCast(forcast24);

          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }

      getWeather();
    }
  };

  const handleSearch = async () => {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityText}&days=3`; // Change to forecast API with 3 days
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "b5ab53305emsh4d78561239fb906p1da757jsne5442cea8267",
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        console.log("Search result: ", result); // Log the result
        setSearchedCity(result);
        setFalse();
      } else {
        console.log("Error: ", response.status);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  // Log the updated todayCast2 in a separate useEffect

  const addSearchedCityToList = async (data: WeatherData) => {
    try {
      if (data) {
        const cityName = data?.location.name;
        const countryName = data?.location.country;

        const weatherDataRef = collection(firestore, "weatherData2");

        // Create a query with multiple where conditions
        const q = query(
          weatherDataRef,
          where("location.name", "==", cityName),
          where("location.country", "==", countryName)
        );

        // Execute the query and get the results
        const querySnapshot = await getDocs(q);

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
          };

          const docRef = await addDoc(
            collection(firestore, "weatherData2"),
            weatherData
          );
          console.log("Document written with ID: ", docRef.id);

          // Reset searchedCity after the city is added

          setStoredCity(data);
          setTrue();
        } else {
          console.log("City already exists");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    initialSearch,

    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText, // So users can type the city name
    addSearchedCityToList,
    searchedCity,
    todayCast2,
    setSearchedCity,
  };
};

export default useHandleSearch;

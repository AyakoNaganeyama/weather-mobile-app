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

import { addDoc, collection } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import { WeatherData } from "../types/forcastType";

const useHandleSearch = () => {
  const [city, setCity] = useState(null);
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();
  const [location, setLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [cityText, setCityText] = useState("");
  const [todayCast, setTodayCast] = useState([]);

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
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityText}`;
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
        setCity(result);
        console.log(result);

        //change to firebase ///////////////////////////////////////////////////

        const weatherData = {
          location: {
            name: result.location.name,
            region: result.location.region,
            country: result.location.country,
            lat: result.location.lat,
            lon: result.location.lon,
            tz_id: result.location.tz_id,
            localtime_epoch: result.location.localtime_epoch,
            localtime: result.location.localtime,
          },
          current: {
            last_updated_epoch: result.current.last_updated_epoch,
            last_updated: result.current.last_updated,
            temp_c: result.current.temp_c,
            temp_f: result.current.temp_f,
            is_day: result.current.is_day,
            wind_mph: result.current.wind_mph,
            wind_kph: result.current.wind_kph,
            wind_degree: result.current.wind_degree,
            wind_dir: result.current.wind_dir,
            pressure_mb: result.current.pressure_mb,
            pressure_in: result.current.pressure_in,
            precip_mm: result.current.precip_mm,
            precip_in: result.current.precip_in,
            humidity: result.current.humidity,
            cloud: result.current.cloud,
            feelslike_c: result.current.feelslike_c,
            feelslike_f: result.current.feelslike_f,
            windchill_c: result.current.windchill_c,
            windchill_f: result.current.windchill_f,
            heatindex_c: result.current.heatindex_c,
            heatindex_f: result.current.heatindex_f,
            dewpoint_c: result.current.dewpoint_c,
            dewpoint_f: result.current.dewpoint_f,
            vis_km: result.current.vis_km,
            vis_miles: result.current.vis_miles,
            uv: result.current.uv,
            gust_mph: result.current.gust_mph,
            gust_kph: result.current.gust_kph,
          },
        };

        const docRef = await addDoc(
          collection(firestore, "weatherData"),
          weatherData
        );
        console.log("Document written with ID: ", docRef.id);
        ///////////////////////////////////////////////////////////////////////

        // Store the city data to AsyncStorage
        // const jsonValue = await AsyncStorage.getItem("cities2");

        // let cities = [];

        // if (jsonValue != null) {
        //   cities = JSON.parse(jsonValue);
        // } else {
        //   cities = [];
        // }

        // Add the new Todo to the existing list (or to the empty array)
        // cities.push(result);

        //back object array to json string
        // const updatedJsonValue = JSON.stringify(cities);
        // Save the updated list back to AsyncStorage
        // await AsyncStorage.setItem("cities2", updatedJsonValue);

        // const returned = await AsyncStorage.getItem("cities2");
        // console.log("retuend Item", returned);
        setStoredCity(result);
        setCurrentCity(null);
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    initialSearch,
    city,
    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText, // So users can type the city name
  };
};

export default useHandleSearch;

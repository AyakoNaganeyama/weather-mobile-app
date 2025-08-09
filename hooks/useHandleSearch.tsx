import { useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { convertHours } from "@/util/convertHours";
import { firestore } from "@/firebaseConfig";
import { HourForecast } from "@/types/HourForecast";
import { useHandleCityList } from "./useHandleCityList";
import { WeatherData } from "@/types/forcastType";
import * as Location from "expo-location";
import useAucklandWeather from "@/stores/aucklandImageStore";
import useBooleanStore from "@/stores/isSearched";
import useCityStore from "@/stores/cityStore";
import useIsExist from "@/stores/isExist";

// this contains inital search (current location weather ) and search for other cities functions
export function useHandleSearch() {
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();
  const [location, setLocation] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState<WeatherData | null>(null);
  const [searchedCity, setSearchedCity] = useState<WeatherData | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null | undefined>(null);
  const [cityText, setCityText] = useState("");
  const [todayCast, setTodayCast] = useState<HourForecast[]>([]);
  const [formatted, setFormatted] = useState([]);
  const [todayCast2, setTodayCast2] = useState([]);
  const [isS, setIsS] = useState(false);
  const { isActive, setTrue, setFalse } = useBooleanStore(); // when city is added to fire store, change global state to false for not showing <Searched>.tsx in explore.tsx
  const { isExist, setTrue2, setFalse2 } = useIsExist(); // for hiding and showing add city button
  const { handleDelete, cities, fetchCityList, addSearchedCityToList } =
    useHandleCityList();

  const { storedAuckland, setStoredAuckland, clearStoredAuckland } =
    useAucklandWeather(); // this might be used for explore.tsx to show current weather background image but currently blakc background

  // as soon as user open the app useEffect this function in index.tsx
  const initialSearch = async () => {
    // Ask for permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();

    console.log("status:", status);
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    console.log("fetching location");
    // Get the current location
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    console.log("location", location);
    setLocation(location);

    console.log("reversing geo code");
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude, // Fixed the variable name
      longitude: location.coords.longitude,
    });
    console.log("reverseGeocode:", reverseGeocode);
    // search by city name, could have been by lon and lat
    if (reverseGeocode.length > 0) {
      // Set the city name
      let cityName = reverseGeocode[0].city;
      // const today = new Date().toISOString().split('T')[0];

      console.log(cityName);

      async function getWeather() {
        const url = `${process.env.EXPO_PUBLIC_API_URL}?q=${location.coords.latitude},${location.coords.longitude}&days=3`;

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.EXPO_PUBLIC_API_KEY,
            "X-RapidAPI-Host": process.env.EXPO_PUBLIC_HOST,
          },
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();

          if (result.error) {
            console.error("API error:", result.error.message);
            setErrorMsg(result.error.message);
            return;
          }

          if (
            !result.forecast ||
            !result.forecast.forecastday ||
            result.forecast.forecastday.length === 0
          ) {
            console.warn("No forecast data available");
            setErrorMsg("No forecast data available");
            return;
          }

          addSearchedCityToList(result);
          setCurrentCity(result);
          console.log("Result:", result.location.name);
          setStoredAuckland(result);

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
          // how many empty array is left
          let tomorrowForcast = 24 - forcast24.length;
          console.log(forcast24.length, tomorrowForcast);
          // fill the rest of empty array with tomorrow's forcast
          if (tomorrowForcast > 0) {
            for (let i = 0; i < tomorrowForcast; i++) {
              forcast24.push(result.forecast.forecastday[1].hour[i]);
            }
          }

          forcast24.forEach((hour) => {
            console.log(`Time: ${hour.time}, Temperature: ${hour.temp_c}°C`);
          });

          let formatted = convertHours(forcast24, result.location.tz_id);

          setTodayCast(formatted);

          console.log(result);
        } catch (error) {
          console.error("Fetch weather error:", error);
          setErrorMsg("Failed to fetch weather data");
        }
      }

      getWeather();
    }
  };

  // connected to search button in explore.tsx
  const handleSearch = async () => {
    console.log("city text", cityText);
    const url = `${process.env.EXPO_PUBLIC_API_URL}?q=${cityText}&days=3`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.EXPO_PUBLIC_API_KEY,
        "x-rapidapi-host": process.env.EXPO_PUBLIC_HOST,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        console.log("Search result: ", result);
        setSearchedCity(result);
        checkIfCityAlreadyExists(result);
        setFalse();
      } else {
        console.log("Error: ", response.status);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  // This is used in handleSearch function to check if city already exists in firebase

  const checkIfCityAlreadyExists = async (result: WeatherData) => {
    try {
      const lat = result?.location.lat;
      const lon = result?.location.lon;

      const weatherDataRef = collection(firestore, "weatherData2");

      // Create a query with multiple where conditions
      const q = query(
        weatherDataRef,
        where("location.lat", "==", lat),
        where("location.lon", "==", lon)
      );

      // Execute the query and get the results
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setFalse2();
        console.log(isExist);
      } else {
        setTrue2();
        console.log(isExist);
      }
    } catch (err) {
      console.log(err);
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

    searchedCity,
    todayCast2,
    setSearchedCity,
    formatted,
  };
}

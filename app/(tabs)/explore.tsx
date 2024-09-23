import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import useCityStore from "../stores/cityStore";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

interface WeatherData {
  location: Location;
  current: CurrentWeather;
}

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

interface WeatherCondition {
  text: string; // Description of the weather condition
  icon: string; // URL to the weather condition icon
  code: number; // Weather code for condition
}

const Explore = () => {
  const [cities, setCities] = useState<any[]>([]);

  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();

  useEffect(() => {
    (async () => {
      try {
        /////////////////change to firebase //////////////////////////////////////

        // Change to Firebase
        const weatherDataRef = collection(firestore, "weatherData");
        const querySnapshot = await getDocs(weatherDataRef);

        // Convert `querySnapshot` to an array of objects
        const storedCities: any[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCities(storedCities);
        console.log(storedCities);
        ////////////////////////////////////////////////////////////////////
        // const jsonValue = await AsyncStorage.getItem("cities2");

        // let storedCities = [];

        // if (jsonValue != null) {
        //   storedCities = JSON.parse(jsonValue);
        // }

        // setCities(storedCities); // Update state with stored cities
        // console.log(storedCities);
      } catch (error) {
        console.error("Failed to load cities from AsyncStorage:", error);
      }
    })();
  }, [storedCity]);

  return (
    <View>
      {cities.length > 0 ? (
        cities
          .filter((city) => city !== null) // Filter out null values
          .map((city, index) => (
            <Link href={`/Listings/${city.location?.name}`} key={index}>
              <Text>
                {city.location?.name} - {city.location?.country}
              </Text>
            </Link>
          ))
      ) : (
        <Text>No cities found.</Text>
      )}
    </View>
  );
};

export default Explore;

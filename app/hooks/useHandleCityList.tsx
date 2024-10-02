import { View, Text } from "react-native";
import React from "react";
import { WeatherData } from "../types/forcastType";
import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const useHandleCityList = () => {
  const [cities, setCities] = useState<WeatherData[]>([]);
  const handleDelete = (city: string, country: string) => {
    console.log(city);
    console.log(country);
  };
  const fetchCityList = async () => {
    try {
      // Fetching data from Firebase Firestore
      const weatherDataRef = collection(firestore, "weatherData2");
      const querySnapshot = await getDocs(weatherDataRef);

      // Convert `querySnapshot` to an array of objects, ensuring it's typed correctly
      const storedCities: WeatherData[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as WeatherData[];

      // Update state with the fetched cities
      setCities(storedCities);
      console.log("Stored cities from Firestore:", storedCities);
    } catch (error) {
      console.error("Failed to load cities from Firestore:", error);
    }
  };

  return { handleDelete, cities, fetchCityList };
};

export default useHandleCityList;

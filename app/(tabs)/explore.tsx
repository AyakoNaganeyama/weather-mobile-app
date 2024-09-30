import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import useCityStore from "../stores/cityStore";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { WeatherData } from "../types/forcastType"; // Make sure the path is correct for your types

const Explore = () => {
  // Use WeatherData[] for better typing
  const [cities, setCities] = useState<WeatherData[]>([]);

  // Zustand store usage
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();

  useEffect(() => {
    (async () => {
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
    })();
  }, [storedCity]);

  return (
    <View>
      {cities.length > 0 ? (
        cities
          .filter((city) => city.location) // Only include cities with a valid location
          .map((city, index) => (
            <Link href={`/Listings/${city.location.name}`} key={index}>
              <Text>
                {city.location.name} - {city.location.country}
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

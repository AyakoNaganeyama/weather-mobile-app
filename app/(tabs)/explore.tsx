import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import useCityStore from "../stores/cityStore";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { WeatherData } from "../types/forcastType";

import useHandleCityList from "../hooks/useHandleCityList";

const Explore = () => {
  // Use WeatherData[]

  const { handleDelete, cities, fetchCityList } = useHandleCityList();

  // Zustand store usage
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();

  useEffect(() => {
    fetchCityList();
  }, [storedCity]);

  return (
    <View>
      {cities.length > 0 ? (
        cities
          .filter((city) => city.location)
          .map((city, index) => (
            <View key={index}>
              <Link href={`/Listings/${city.location.name}`}>
                <Text>
                  {city.location.name} - {city.location.country}
                </Text>
              </Link>
              <TouchableOpacity
                onPress={() =>
                  handleDelete(city.location.name, city.location.country)
                }
                style={{ marginLeft: 10 }}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
      ) : (
        <Text>No cities found.</Text>
      )}
    </View>
  );
};

export default Explore;

import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [city, setCity] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve cities from AsyncStorage
        const jsonValue = await AsyncStorage.getItem("cities2");

        if (jsonValue) {
          const cities = JSON.parse(jsonValue);

          // Find the city that matches the id
          const matchedCity = cities.find(
            (city: any) => city.location.name === id
          );

          if (matchedCity) {
            setCity(matchedCity); // Set the matched city to the state
          } else {
            console.log("City not found");
          }
        }
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };

    fetchData();
  }, [id]);

  console.log(id);
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text>ID: {id}</Text>
        {city ? (
          <View style={{ marginTop: 20 }}>
            <Text>City: {city.location.name}</Text>
            <Text>Region: {city.location.region || "N/A"}</Text>
            <Text>Country: {city.location.country}</Text>
            <Text>Latitude: {city.location.lat}</Text>
            <Text>Longitude: {city.location.lon}</Text>
            <Text>Timezone: {city.location.tz_id}</Text>
            <Text>Local Time: {city.location.localtime}</Text>

            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              Current Weather:
            </Text>
            <Text>
              Temperature: {city.current.temp_c}°C / {city.current.temp_f}°F
            </Text>
            <Text>Condition: {city.current.condition.text}</Text>
            <Text>
              Wind: {city.current.wind_kph} kph / {city.current.wind_mph} mph
            </Text>
            <Text>Wind Direction: {city.current.wind_dir}</Text>
            <Text>
              Pressure: {city.current.pressure_mb} mb /{" "}
              {city.current.pressure_in} in
            </Text>
            <Text>
              Precipitation: {city.current.precip_mm} mm /{" "}
              {city.current.precip_in} in
            </Text>
            <Text>Humidity: {city.current.humidity}%</Text>
            <Text>Cloud Cover: {city.current.cloud}%</Text>
            <Text>
              Feels Like: {city.current.feelslike_c}°C /{" "}
              {city.current.feelslike_f}°F
            </Text>
            <Text>
              Visibility: {city.current.vis_km} km / {city.current.vis_miles}{" "}
              miles
            </Text>
            <Text>UV Index: {city.current.uv}</Text>
            <Text>
              Gust Speed: {city.current.gust_kph} kph / {city.current.gust_mph}{" "}
              mph
            </Text>
          </View>
        ) : (
          <Text>Loading city data...</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Page;

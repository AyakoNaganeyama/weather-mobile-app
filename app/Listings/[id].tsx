import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [city, setCity] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        //////////////////////////////////changed to firebase ///////////////////////////////////

        const querySnapshot = await getDocs(
          collection(firestore, "weatherData")
        );

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });

        const cities: any[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const matchedCity = cities.find((city) => city.location.name === id);

        if (matchedCity) {
          setCity(matchedCity);
        } else {
          console.log("City not found");
        }

        ////////////////////////////////////////////////////////////////////////////////////////

        // Retrieve cities from AsyncStorage
        // const jsonValue = await AsyncStorage.getItem("cities2");

        // if (jsonValue) {
        //   const cities = JSON.parse(jsonValue);

        //   // Find the city that matches the id
        //   const matchedCity = cities.find(
        //     (city: any) => city.location.name === id
        //   );

        //   if (matchedCity) {
        //     setCity(matchedCity); // Set the matched city to the state
        // } else {
        //   console.log("City not found");
        // }
        // }
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
              Temperature: {city.current?.temp_c}°C / {city.current?.temp_f}°F
            </Text>
            <Text>Condition: {city.current?.condition?.text || "N/A"}</Text>
            {/* ...rest of the code... */}
          </View>
        ) : (
          <Text>Loading city data...</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Page;

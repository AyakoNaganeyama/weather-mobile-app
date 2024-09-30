import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Button,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import useShare from "../hooks/useShare";
import { Link } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getImage } = useGetImage();
  const { onShare } = useShare();

  const [city, setCity] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the URL with the provided id
        const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${id}`;
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "b5ab53305emsh4d78561239fb906p1da757jsne5442cea8267",
            "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
          },
        };

        const response = await fetch(url, options);
        if (response.ok) {
          const result = await response.json();
          setCity(result); // Set the city state with the fetched data
          console.log(result); // Optional: log the result for debugging
        } else {
          console.error(
            `Error fetching city: ${response.status} ${response.statusText}`
          );
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
      <ImageBackground
        source={getImage(
          city?.current?.condition?.text || "Unknown",
          city?.current?.is_day ?? 0 // Use 0 (night) as a default if is_day is undefined
        )}
        style={styles.backgroundImage}
      >
        <View style={{ padding: 20 }}>
          <Text>ID: {id}</Text>
          {city ? (
            <View style={{ marginTop: 20 }}>
              <Link href={`/(modals)/${city.location?.name}`}>
                <Text>City: {city.location.name}</Text>
              </Link>
              <Link href={`/(modals)/${city.location.region || "N/A"}`}>
                <Text>Region: {city.location.region || "N/A"}</Text>
              </Link>
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
      </ImageBackground>
      <View style={{ marginTop: 50 }}>
        <Button onPress={() => onShare(city)} title="Share" />
      </View>
    </ScrollView>
  );
};

export default Page;
const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    flex: 1,
  },
});

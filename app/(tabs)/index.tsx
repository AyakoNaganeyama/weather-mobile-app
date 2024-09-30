import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
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
import useCityStore from "../stores/cityStore";
import { addDoc, collection } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import useHandleSearch from "../hooks/useHandleSearch";

const index = () => {
  const {
    initialSearch,
    city,
    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText,
  } = useHandleSearch();

  const { getImage } = useGetImage();
  useEffect(() => {
    initialSearch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Link href={"/(modals)/testing"}>Testing</Link>
          <Link href={"/Listings/1337"}>ID </Link>
        </View>

        <View style={styles.inputHead}>
          <TextInput
            placeholder="Search City"
            onChangeText={(text) => setCityText(text)}
            value={cityText} // Display the city name being typed
            placeholderTextColor="gray"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSearch} // Call the hook's search function
            disabled={cityText === ""}
            style={[styles.AddButton, cityText === "" && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {city && (
          // <ImageBackground
          //   source={{
          //     uri: city.current.is_day
          //       ? "https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          //       : "https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          //   }}

          <ImageBackground
            source={getImage(city.current.condition.text, city.current.is_day)}
            style={styles.backgroundImage}
          >
            <View style={styles.con2}>
              <View>
                <Text style={styles.heading}>{city.location.name}</Text>
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
                  Wind: {city.current.wind_kph} kph / {city.current.wind_mph}{" "}
                  mph
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
                  Visibility: {city.current.vis_km} km /{" "}
                  {city.current.vis_miles} miles
                </Text>
                <Text>UV Index: {city.current.uv}</Text>
                <Text>
                  Gust Speed: {city.current.gust_kph} kph /{" "}
                  {city.current.gust_mph} mph
                </Text>
                <Feather name="settings" size={24} color="white" />
              </View>
            </View>
          </ImageBackground>
        )}

        {errorMsg && <Text>{errorMsg}</Text>}

        {currentCity && (
          <ImageBackground
            source={{
              uri: currentCity.current.is_day
                ? "https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                : "https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
            style={styles.backgroundImage}
          >
            <View>
              <View style={styles.temp}>
                <Text style={styles.tempShown}>
                  {currentCity.current.temp_c}°C
                </Text>
                <Text style={styles.tempShown}>
                  {currentCity.location.name}
                </Text>
                <Text style={styles.text}>
                  {currentCity.current.condition.text}
                </Text>
                <Text>Test</Text>
                <Text style={styles.text}>
                  {currentCity.forecast.forecastday[0].date}
                </Text>
                <Text style={styles.text}>
                  {currentCity.forecast.forecastday[0].day.maxtemp_c}
                </Text>
                <Text style={styles.text}>
                  day2{currentCity.forecast.forecastday[1].date}
                </Text>
                <Text style={styles.text}>
                  day3{currentCity.forecast.forecastday[1].day.maxtemp_c}
                </Text>
              </View>

              <Text style={{ fontSize: 30 }}>Test</Text>

              <Text style={{ fontSize: 24 }}>24 hour</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignContent: "center",
                  gap: 20,
                  paddingHorizontal: 16,
                }}
              >
                {todayCast.map((i, ind) => (
                  <TouchableOpacity key={ind}>
                    <Text>{i.time}</Text>
                    <Text>{i.temp_c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignContent: "center",
                  gap: 20,
                  paddingHorizontal: 16,
                }}
              >
                {currentCity.forecast.forecastday.map((item, index) => (
                  <TouchableOpacity key={index}>
                    <Text>{item.date}</Text>
                    <Text>{item.day.maxtemp_c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.more}>
                <Text style={styles.text}>
                  Feels like {currentCity.current.feelslike_c}°C
                </Text>
                <Text style={styles.text}>
                  <Feather name="wind" size={24} color="white" />{" "}
                  {currentCity.current.wind_kph} kph
                </Text>
              </View>
            </View>
          </ImageBackground>
        )}
        {errorMsg && <Text>{errorMsg}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 30,
  },
  tempShown: {
    fontSize: 150,
    fontWeight: 800,
    color: "#fff",
  },
  temp: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  more: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginTop: 32,
  },
  con2: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flex: 1,
  },
  inputHead: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
    height: 50,
    marginBottom: 30,
  },
  input: {
    width: "70%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#51606b",
    borderRadius: 10,

    fontWeight: "bold",
  },
  AddButton: {
    backgroundColor: "#6c7cac",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#8e979e",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

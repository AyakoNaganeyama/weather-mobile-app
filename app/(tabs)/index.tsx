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
  KeyboardAvoidingView,
  Share,
  Platform,
  Button,
  Dimensions,
  Image,
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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const index = () => {
  const {
    initialSearch,

    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText,
    addSearchedCityToList,
    formatted,
  } = useHandleSearch();

  const { getImage } = useGetImage();
  useEffect(() => {
    initialSearch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for iOS or Android
      >
        {currentCity && (
          <ScrollView>
            <ImageBackground
              source={getImage(
                currentCity?.current?.condition?.text || "Unknown",
                currentCity?.current?.is_day ?? 0
              )}
              style={styles.backgroundImage}
            >
              <View style={styles.container}>
                <Text style={styles.heading}>{currentCity.location.name}</Text>
                <View style={styles.temp}>
                  <Text style={styles.tempShown}>
                    {currentCity.current.temp_c}°C
                  </Text>

                  <Text style={styles.currentCond}>
                    {currentCity.current.condition.text}
                  </Text>

                  <View style={styles.more}>
                    <Text style={styles.text}>
                      Feels like {currentCity.current.feelslike_c}°C
                    </Text>
                    <Text style={styles.text}>
                      <Feather name="wind" size={24} color="white" />{" "}
                      {currentCity.current.wind_kph} kph
                    </Text>
                  </View>

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

                <View
                  style={{
                    backgroundColor: "rgba(0,0,0, 0.5)",

                    padding: 10,
                    borderRadius: 15,
                    marginHorizontal: 20,
                  }}
                >
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      alignContent: "center",
                      gap: 20,
                      paddingHorizontal: 16,
                    }}
                  >
                    {todayCast.map((i, ind) =>
                      ind === 0 ? (
                        <TouchableOpacity key={ind} style={styles.info}>
                          <Text style={styles.text}>Now</Text>

                          {/* Display the condition icon */}
                          <Image
                            source={{ uri: `https:${i.condition.icon}` }}
                            style={{ width: 50, height: 50 }} // Adjust size as needed
                          />
                          <Text style={styles.text}>{i.temp_c}°C</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity key={ind} style={styles.info}>
                          <Text style={styles.text}>{i.time_epoch}</Text>
                          <Image
                            source={{ uri: `https:${i.condition.icon}` }}
                            style={{ width: 50, height: 50 }} // Adjust size as needed
                          />
                          <Text style={styles.text}>{i.temp_c}°C</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>

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
              </View>
            </ImageBackground>
          </ScrollView>
        )}
        {errorMsg && <Text>{errorMsg}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  currentCond: {
    color: "#fff",
    fontSize: 30,
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
    fontSize: 60,
    textAlign: "center",
  },
  tempShown: {
    fontSize: 100,
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
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  container2: {
    padding: 10,
  },
  searchContainer2: {
    flexDirection: "row", // Align input and button in a row
    alignItems: "center",
  },
  input2: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  searchButton2: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  buttonText2: {
    color: "white",
    fontSize: 16,
  },
  info: {
    width: Dimensions.get("screen").width / 5,

    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const index = () => {
  const {
    initialSearch,

    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText,

    formatted,
  } = useHandleSearch();

  const { getImage } = useGetImage();
  useEffect(() => {
    initialSearch().then(() => {
      setLoading(false);
    });
  }, []);

  const coverttoDay = (d: any) => {
    const date = new Date(d);
    const options: Intl.DateTimeFormatOptions = { weekday: "long" }; // Correct type for 'weekday'
    const dayOfWeek = date.toLocaleDateString("en-US", options);
    return dayOfWeek;
  };
  const [loading, setLoading] = useState(true);
  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ImageBackground
      source={getImage(
        currentCity?.current?.condition?.text || "Unknown",
        currentCity?.current?.is_day ?? 0
      )}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {currentCity && (
            <ScrollView>
              <View style={styles.container}>
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0, 0.7)",

                    padding: 10,
                    borderRadius: 15,
                    marginHorizontal: 20,
                    marginBottom: 20,
                  }}
                >
                  <View style={styles.main}>
                    <Text style={styles.heading}>
                      {currentCity.location.name}
                    </Text>
                    <View style={styles.temp}>
                      <Text style={styles.tempShown}>
                        {currentCity.current.temp_c}°C
                      </Text>

                      <Text style={styles.currentCond}>
                        {currentCity.current.condition.text}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: "rgba(0,0,0, 0.7)",

                    padding: 10,
                    borderRadius: 15,
                    marginHorizontal: 20,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,

                      borderBottomColor: "gray",
                      paddingBottom: 10,
                      paddingTop: 10,
                      marginHorizontal: 16,
                    }}
                  >
                    <Text style={styles.text}>24 HOUR FORCAST</Text>
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

                <View
                  style={{
                    backgroundColor: "rgba(0,0,0, 0.7)",

                    padding: 10,
                    borderRadius: 15,
                    marginHorizontal: 20,
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,

                      borderBottomColor: "gray",
                      paddingBottom: 10,
                      paddingTop: 10,
                      marginHorizontal: 16,
                    }}
                  >
                    <Text style={styles.text}>3-DAY FORCAST</Text>
                  </View>

                  {/*****************************3 DAY FORCAST*******************************************/}
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      alignContent: "center",
                      gap: 20,
                      paddingHorizontal: 16,
                    }}
                  >
                    {currentCity.forecast.forecastday.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          borderBottomWidth:
                            index !==
                            currentCity.forecast.forecastday.length - 1
                              ? 1
                              : 0, // Adding border except for the last item
                          borderBottomColor: "gray",
                          paddingBottom: 10,
                          paddingTop: 10,
                          flexDirection: "row",

                          alignItems: "center",
                        }}
                      >
                        {index === 0 ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View style={{ width: "40%" }}>
                                <Text style={styles.threeDay}>Today</Text>
                              </View>

                              <Image
                                source={{
                                  uri: `https:${item.day.condition.icon}`,
                                }}
                                style={{ width: "20%", height: 50 }}
                              />
                            </View>

                            <View
                              style={{ flexDirection: "row", width: "40%" }}
                            >
                              <View
                                style={{
                                  marginRight: 10,
                                  flexDirection: "row",
                                }}
                              >
                                <FontAwesome6
                                  name="temperature-arrow-up"
                                  size={24}
                                  color="white"
                                />
                                <Text style={styles.threeDay}>
                                  {item.day.maxtemp_c}
                                </Text>
                              </View>

                              <FontAwesome6
                                name="temperature-arrow-down"
                                size={24}
                                color="white"
                              />
                              <Text style={styles.threeDay}>
                                {item.day.mintemp_c}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flex: 1,
                              }}
                            >
                              <View style={{ width: "40%" }}>
                                <Text style={styles.threeDay}>
                                  {coverttoDay(item.date)}
                                </Text>
                              </View>
                              <Image
                                source={{
                                  uri: `https:${item.day.condition.icon}`,
                                }}
                                style={{ width: "20%", height: 50 }}
                              />
                            </View>

                            <View
                              style={{ flexDirection: "row", width: "40%" }}
                            >
                              <View
                                style={{
                                  marginRight: 10,
                                  flexDirection: "row",
                                }}
                              >
                                <FontAwesome6
                                  name="temperature-arrow-up"
                                  size={24}
                                  color="white"
                                />
                                <Text style={styles.threeDay}>
                                  {item.day.maxtemp_c}
                                </Text>
                              </View>
                              <FontAwesome6
                                name="temperature-arrow-down"
                                size={24}
                                color="white"
                              />
                              <Text style={styles.threeDay}>
                                {item.day.mintemp_c}
                              </Text>
                            </View>
                          </>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          )}
          {errorMsg && <Text>{errorMsg}</Text>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    marginTop: 50,
    marginBottom: 50,
  },
  threeDay: {
    color: "#fff",
    fontSize: 18,
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
    marginBottom: 30,
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

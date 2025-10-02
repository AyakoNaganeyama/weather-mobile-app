import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { covertToDay } from "@/util/convertToDay";
import { Feather } from "@expo/vector-icons";
import { Loader } from "@/components/Loader";
import { useFrontEndLogic } from "@/hooks/useFrontEndLogic";
import { useGetImage } from "@/hooks/useGetImage";
import { useHandleSearch } from "@/hooks/useHandleSearch";
import { useShare } from "@/hooks/useShare";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

//this page shows current user's location's weather
const index = () => {
  // to loading state to make sure to display after all the operations in InitislSearch() are done, used inside useEffect here
  const [backgroundLoading, setBackgroundLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // this function gets background image based on current weather in the city
  const { getImage } = useGetImage();
  const { onShare } = useShare();
  const { currentCity, errorMsg, initialSearch, todayCast } = useHandleSearch();
  // these functions are frontend function that returns string for weather details
  const {
    checkCloud,
    checkFeelsLike,
    checkHumidity,
    checkUV,
    checkVisibility,
    checkWind,
  } = useFrontEndLogic();

  // as soon as the page load, call the function initialSearch() for fetching current locaiton data
  useEffect(() => {
    console.log("=====================================");
    console.log("fetching initial search data");
    console.log("=====================================");
    initialSearch().then(() => {
      console.log("=====================================");
      console.log("search data completed");
      console.log("=====================================");

      setLoading(false);
    });
  }, []);

  // preload image here so faster once called in view
  const backGroundImageSrc = getImage(
    currentCity?.current?.condition?.text || "Unknown",
    currentCity?.current?.is_day ?? 0
  );

  // while data is being fetched display loader
  if (loading) {
    return <Loader />;
  }

  // if loading state is false, show the weather info
  // takes a while to load background image so add nested loader
  return (
    <ImageBackground
      source={backGroundImageSrc}
      style={styles.backgroundImage}
      onLoadEnd={() => setBackgroundLoading(false)}
    >
      {backgroundLoading ? (
        <Loader />
      ) : (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {currentCity && (
              <ScrollView>
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => onShare(currentCity)}
                    style={{
                      marginTop: 10,
                      padding: 10,
                      marginHorizontal: 20,
                      marginBottom: 20,
                      width: 50,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Entypo name="share-alternative" size={24} color="white" />
                  </TouchableOpacity>
                  {/*******************************main current city information************************************/}
                  <View
                    style={{
                      padding: 10,
                      borderRadius: 15,
                      marginHorizontal: 20,
                      marginBottom: 20,

                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <View style={styles.main}>
                      <Text style={styles.heading}>
                        {currentCity.location.name}
                      </Text>
                      <View style={styles.temp}>
                        <Text style={styles.tempShown}>
                          {Math.round(currentCity.current.temp_c)}°
                        </Text>

                        <Text style={styles.currentCond}>
                          {currentCity.current.condition.text}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 5,
                          }}
                        >
                          <View style={{ marginRight: 5 }}>
                            <Text style={styles.currentCond}>
                              L:
                              {Math.round(
                                currentCity.forecast.forecastday[0].day
                                  .mintemp_c
                              )}
                              °
                            </Text>
                          </View>
                          <Text style={styles.currentCond}>
                            H:
                            {Math.round(
                              currentCity.forecast.forecastday[0].day.maxtemp_c
                            )}
                            °
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/**********************************24 hour forcast***************************************************************/}

                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0, 0.2)",

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
                            <Text style={{ color: "white" }}>Now</Text>

                            {/* Display the condition icon */}
                            <Image
                              source={{ uri: `https:${i.condition.icon}` }}
                              style={{ width: 50, height: 50 }} // Adjust size as needed
                            />
                            <Text style={{ color: "white" }}>
                              {Math.round(i.temp_c)}°C
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity key={ind} style={styles.info}>
                            <Text style={{ color: "white" }}>
                              {i.time_epoch}
                            </Text>
                            <Image
                              source={{ uri: `https:${i.condition.icon}` }}
                              style={{ width: 50, height: 50 }} // Adjust size as needed
                            />
                            <Text style={{ color: "white" }}>
                              {Math.round(i.temp_c)}°C
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </ScrollView>
                  </View>
                  {/*****************************3 DAY FORCAST*******************************************/}
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0, 0.2)",

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
                                    {covertToDay(item.date)}
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

                {/**************************************other extra information, frontend funciotns are used*******************************************/}

                {/**************************row1**********************************************/}
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 200,
                    }}
                  >
                    {/***********************UV****************************************************/}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Feather name="sun" style={styles.text} />
                          <Text style={styles.text}>UV index</Text>
                        </View>
                      </View>

                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {currentCity.current.uv}
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkUV(currentCity.current.uv)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/***********************Humidity****************************************************/}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name="air-humidifier"
                            style={styles.text}
                          />
                          <Text style={styles.text}>Humidity</Text>
                        </View>
                      </View>
                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {currentCity.current.humidity}%
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkHumidity(currentCity.current.humidity)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/**************row2****************/}
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 200,
                    }}
                  >
                    {/******************wind*********************************/}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Feather name="wind" style={styles.text} />
                          <Text style={styles.text}>Wind</Text>
                        </View>
                      </View>
                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {currentCity.current.wind_kph}km/h
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkWind(currentCity.current.wind_kph)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/*******************Feels like****************************************/}

                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesome6
                            name="temperature-empty"
                            style={styles.text}
                          />
                          <Text style={styles.text}>Feels like</Text>
                        </View>
                      </View>
                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {Math.round(currentCity.current.feelslike_f)}°
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkFeelsLike(currentCity.current.feelslike_c)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/**************row3****************/}
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: 200,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AntDesign name="cloudo" style={styles.text} />
                          <Text style={styles.text}>Cloud</Text>
                        </View>
                      </View>
                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {currentCity.current.cloud}%
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkCloud(currentCity.current.cloud)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.2)",

                        padding: 10,
                        borderRadius: 15,
                        width: "48%",
                        height: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}
                      >
                        <View
                          style={{
                            height: "30%",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AntDesign name="eyeo" style={styles.text} />
                          <Text style={styles.text}>Visibility</Text>
                        </View>
                      </View>
                      <View style={{ height: "50%" }}>
                        <Text
                          style={{
                            color: "white",

                            fontSize: 40,
                          }}
                        >
                          {currentCity.current.vis_km}km
                        </Text>
                        <Text style={styles.threeDay}>
                          {checkVisibility(currentCity.current.vis_km)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    marginTop: 10,
    marginBottom: 10,
  },
  threeDay: {
    color: "#fff",
    fontSize: 18,
  },
  currentCond: {
    color: "#fff",
    fontSize: 20,
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
    fontSize: 30,
    textAlign: "center",
  },
  tempShown: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#fff",
  },
  temp: {
    alignItems: "center",
  },
  text: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    paddingBottom: 20,
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

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WeatherData } from "../types/forcastType";
import { Feather } from "@expo/vector-icons";
import useHandleSearch from "../hooks/useHandleSearch";
import Entypo from "@expo/vector-icons/Entypo";
import useBooleanStore from "../stores/isSearched";
import useGetImage from "../hooks/useGetImage";
import useIsExist from "../stores/isExist";
const { getImage } = useGetImage();
import useHandleCityList from "../hooks/useHandleCityList";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useFrontEndLogic from "../hooks/useFrontEndLogic";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

// this page shows searched city's weather result

interface SearchedProps {
  data: WeatherData; // Accept the data as props
}

// searched city's weather data is passed to this page from explore.tsx
const Searched: React.FC<SearchedProps> = ({ data }) => {
  const { addSearchedCityToList } = useHandleCityList(); // importing the function for adding city to fire store if user wants

  const [cast, setCast] = useState([]); // to store 24-hour forecast
  const { isActive, setTrue } = useBooleanStore(); // to hide or show city list page
  const { isExist } = useIsExist(); // if city already exists in firestore hide the add city button
  const {
    checkUV,
    checkVisibility,
    checkFeelsLike,
    checkHumidity,
    checkWind,
    checkCloud,
  } = useFrontEndLogic();

  // as soon as the page load, extract 24 hour forcast and store in cast
  useEffect(() => {
    if (data && data.forecast && data.forecast.forecastday[0]) {
      const forecastHours = data.forecast.forecastday[0].hour;
      const currentEpoch = Math.floor(Date.now() / 1000);
      let forcast24 = [];
      let index = 0;
      const hourInSeconds = 3600;

      for (let i = 0; i < forecastHours.length; i++) {
        let hour = forecastHours[i];
        if (Math.abs(hour.time_epoch - currentEpoch) <= hourInSeconds) {
          index = i;
          break;
        }
      }

      for (let j = index; j < forecastHours.length; j++) {
        forcast24.push(forecastHours[j]);
      }

      let tomorrowForcast = 24 - forcast24.length;
      if (tomorrowForcast > 0) {
        for (let i = 0; i < tomorrowForcast; i++) {
          forcast24.push(data.forecast.forecastday[1].hour[i]);
        }
      }

      setCast(forcast24); // Updates the state
    }
  }, [data]);

  const hidePage = () => {
    setTrue();
  };

  return (
    <ScrollView>
      <ImageBackground
        source={getImage(
          data?.current?.condition?.text || "Unknown",
          data?.current?.is_day ?? 0
        )}
        style={styles.backgroundImage}
      >
        <View style={{ marginHorizontal: 10 }}>
          {/* hide page and Add City Button */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => hidePage()}
              style={{
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                marginHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>

            {/*if searched city does not exist in firestore, show add button*/}
            {!isExist && (
              <TouchableOpacity
                style={styles.AddButton}
                onPress={() => addSearchedCityToList(data)}
              >
                <Text style={styles.buttonText}>Add City</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Current Weather Display */}
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
              <Text style={styles.heading}>{data.location.name}</Text>
              <View style={styles.temp}>
                <Text style={styles.tempShown}>{data.current.temp_f}°</Text>

                <Text style={styles.currentCond}>
                  {data.current.condition.text}
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
                      {data.forecast.forecastday[0].day.mintemp_f}°
                    </Text>
                  </View>
                  <Text style={styles.currentCond}>
                    H:
                    {data.forecast.forecastday[0].day.maxtemp_f}°
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 24 Hour Forecast ScrollView */}
          <View
            style={{
              backgroundColor: "rgba(0,0,0, 0.7)",
              padding: 10,
              borderRadius: 15,
              marginVertical: 20,
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
              {cast.length > 0 ? (
                cast.map((i, ind) => (
                  <TouchableOpacity key={ind} style={styles.info}>
                    <Text style={{ color: "white" }}>{i.time}</Text>
                    <Image
                      source={{ uri: `https:${i.condition.icon}` }}
                      style={{ width: 50, height: 50 }} // Adjust size as needed
                    />
                    <Text style={{ color: "white" }}>{i.temp_f}°</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.text}>No forecast available.</Text>
              )}
            </ScrollView>
          </View>

          {/* 3 Day Forecast ScrollView */}
          <View
            style={{
              backgroundColor: "rgba(0,0,0, 0.7)",
              padding: 10,
              borderRadius: 15,
              marginVertical: 20,
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
              {data.forecast.forecastday.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderBottomWidth:
                      index !== data.forecast.forecastday.length - 1 ? 1 : 0, // Adding border except for the last item
                    borderBottomColor: "gray",
                    paddingBottom: 10,
                    paddingTop: 10,
                    flexDirection: "row",

                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      <Text style={styles.threeDay}>{item.date}</Text>
                    </View>
                    <Image
                      source={{
                        uri: `https:${item.day.condition.icon}`,
                      }}
                      style={{ width: "20%", height: 50 }}
                    />
                  </View>

                  <View style={{ flexDirection: "row", width: "40%" }}>
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
                      <Text style={styles.threeDay}>{item.day.maxtemp_c}</Text>
                    </View>
                    <FontAwesome6
                      name="temperature-arrow-down"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.threeDay}>{item.day.mintemp_c}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Additional Weather Info */}
          <View style={styles.more}>
            <Text style={styles.text}>
              Feels like {data.current.feelslike_c}°C
            </Text>
            <Text style={styles.text}>
              <Feather name="wind" size={24} color="white" />{" "}
              {data.current.wind_kph} kph
            </Text>
          </View>
        </View>

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
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                  {data.current.uv}
                </Text>
                <Text style={styles.threeDay}>{checkUV(data.current.uv)}</Text>
              </View>
            </TouchableOpacity>
            {/***********************Humidity****************************************************/}
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                  {data.current.humidity}%
                </Text>
                <Text style={styles.threeDay}>
                  {checkHumidity(data.current.humidity)}
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
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                  {data.current.wind_kph}km/h
                </Text>
                <Text style={styles.threeDay}>
                  {checkWind(data.current.wind_kph)}
                </Text>
              </View>
            </TouchableOpacity>

            {/*******************Feels like****************************************/}

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                <View
                  style={{
                    height: "30%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome6 name="temperature-empty" style={styles.text} />
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
                  {data.current.feelslike_f}°
                </Text>
                <Text style={styles.threeDay}>
                  {checkFeelsLike(data.current.feelslike_c)}
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
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                  {data.current.cloud}%
                </Text>
                <Text style={styles.threeDay}>
                  {checkCloud(data.current.cloud)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,0, 0.7)",

                padding: 10,
                borderRadius: 15,
                width: "48%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
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
                  {data.current.vis_km}km
                </Text>
                <Text style={styles.threeDay}>
                  {checkVisibility(data.current.vis_km)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Searched;

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
    paddingBottom: 100,
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

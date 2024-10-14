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

// this page shows searched city's weather

interface SearchedProps {
  data: WeatherData; // Accept the data as props
}

// searched city's weather data is passed to this page from explore.tsx
const Searched: React.FC<SearchedProps> = ({ data }) => {
  const { addSearchedCityToList } = useHandleCityList(); // importing the function for adding city to fire store if user wants

  const [cast, setCast] = useState([]); // to store 24-hour forecast
  const { isActive, setTrue } = useBooleanStore(); // to hide or show city list page
  const { isExist } = useIsExist(); // if city already exists in firestore hide the add city button

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
          {/* Add City Button */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => hidePage()}>
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
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
          <View style={styles.temp}>
            <Text style={styles.tempShown}>{data.current.temp_c}°C</Text>
            <Text style={styles.tempShown}>{data.location.name}</Text>
            <Text style={styles.text}>{data.current.condition.text}</Text>
            <Text style={styles.text}>{data.forecast.forecastday[0].date}</Text>
            <Text style={styles.text}>
              Max Temp: {data.forecast.forecastday[0].day.maxtemp_c}°C
            </Text>
            <Text style={styles.text}>
              Day 2: {data.forecast.forecastday[1].date} - Max Temp:{" "}
              {data.forecast.forecastday[1].day.maxtemp_c}°C
            </Text>
            <Text style={styles.text}>
              Day 3: {data.forecast.forecastday[2].date} - Max Temp:{" "}
              {data.forecast.forecastday[2].day.maxtemp_c}°C
            </Text>
          </View>

          {/* 24 Hour Forecast ScrollView */}
          <View
            style={{
              backgroundColor: "rgba(0,0,0, 0.7)",
              padding: 10,
              borderRadius: 15,
              marginVertical: 20,
            }}
          >
            <Text style={styles.text}>24-Hour Forecast</Text>
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
                    <Text style={{ color: "white" }}>{i.temp_c}°C</Text>
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
            }}
          >
            <Text style={styles.text}>3-Day Forecast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignContent: "center",
                gap: 20,
                paddingHorizontal: 16,
              }}
            >
              {data.forecast.forecastday.map((item, index) => (
                <TouchableOpacity key={index} style={styles.info}>
                  <Text style={styles.text}>{item.date}</Text>
                  <Image
                    source={{ uri: `https:${item.day.condition.icon}` }}
                    style={{ width: 50, height: 50 }} // Adjust size as needed
                  />
                  <Text style={styles.text}>{item.day.maxtemp_c}°C</Text>
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
      </ImageBackground>
    </ScrollView>
  );
};

export default Searched;

const styles = StyleSheet.create({
  AddButton: {
    backgroundColor: "#6c7cac",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tempShown: {
    fontSize: 100,
    fontWeight: "800",
    color: "#fff",
  },
  temp: {
    alignItems: "center",
    marginBottom: 30,
  },
  text: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 20,
  },
  more: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginTop: 32,
  },
  backgroundImage: {
    width: "100%",
    flex: 1,
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

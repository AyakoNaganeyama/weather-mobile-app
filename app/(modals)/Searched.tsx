import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
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

interface SearchedProps {
  data: WeatherData; // Accept the data as props
}

const Searched: React.FC<SearchedProps> = ({ data }) => {
  const { addSearchedCityToList } = useHandleCityList();

  const [cast, setCast] = useState([]); // to store 24 hour cast
  const { isActive, setTrue, setFalse } = useBooleanStore(); // to hide or show city list page
  const { isExist, setTrue2, setFalse2 } = useIsExist();

  useEffect(() => {
    if (data && data.forecast && data.forecast.forecastday[0]) {
      console.log("searchedCity", data.location.name);
      const forecastHours = data.forecast.forecastday[0].hour;

      // Proceed only if forecastHours exist
      if (forecastHours && forecastHours.length > 0) {
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
          <Text style={{ fontSize: 24 }}>24-hour forecast</Text>
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
                <TouchableOpacity key={ind}>
                  <Text>{i.time}</Text>
                  <Text>{i.temp_c}°C</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No forecast available.</Text>
            )}
          </ScrollView>

          {/* 3 Day Forecast ScrollView */}
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
              <TouchableOpacity key={index}>
                <Text>{item.date}</Text>
                <Text>{item.day.maxtemp_c}°C</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
    fontSize: 150,
    fontWeight: "800",
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
  backgroundImage: {
    width: "100%",
    flex: 1,
  },
});

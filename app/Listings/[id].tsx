import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import useShare from "../hooks/useShare";

const Page = () => {
  const { id } = useLocalSearchParams();
  const { getImage } = useGetImage();
  const { onShare } = useShare();

  const [city, setCity] = useState(null);
  const [todayCast, setTodayCast] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("city id with lon and rat", id);
        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${id}&days=3`; // 3-day forecast API
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
          setCity(result);

          const currentEpoch = Math.floor(Date.now() / 1000); // Current time in seconds
          const forecastHours = result.forecast.forecastday[0].hour;

          let forcast24 = [];
          let index = 0;
          const hourInSeconds = 3600; // 1 hour in seconds

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
              forcast24.push(result.forecast.forecastday[1].hour[i]);
            }
          }

          setTodayCast(forcast24);
        } else {
          console.log("Failed to fetch weather data. Please try again later.");
        }
      } catch (error) {
        console.log("Fetch error: ", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {city && (
        <ScrollView>
          <ImageBackground
            source={getImage(
              city?.current?.condition?.text || "Unknown",
              city?.current?.is_day ?? 0
            )}
            style={styles.backgroundImage}
          >
            <View>
              <View style={styles.temp}>
                <Text style={styles.tempShown}>{city.current.temp_c}°C</Text>
                <Text style={styles.tempShown}>{city.location.name}</Text>
                <Text style={styles.text}>{city.current.condition.text}</Text>
                <Text style={styles.text}>
                  {city.forecast.forecastday[0].date}
                </Text>
                <Text style={styles.text}>
                  Max Temp: {city.forecast.forecastday[0].day.maxtemp_c}°C
                </Text>
                <Text style={styles.text}>
                  Day 2: {city.forecast.forecastday[1].date}
                </Text>
                <Text style={styles.text}>
                  Day 3 Max Temp: {city.forecast.forecastday[1].day.maxtemp_c}°C
                </Text>
              </View>

              <Text style={{ fontSize: 24 }}>24-hour Forecast</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {todayCast.map((i, ind) => (
                  <TouchableOpacity key={ind}>
                    <Text>{i.time}</Text>
                    <Text>{i.temp_c}°C</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {city.forecast.forecastday.map((item, index) => (
                  <TouchableOpacity key={index}>
                    <Text>{item.date}</Text>
                    <Text>Max Temp: {item.day.maxtemp_c}°C</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.more}>
                <Text style={styles.text}>
                  Feels like {city.current.feelslike_c}°C
                </Text>
                <Text style={styles.text}>
                  Wind: {city.current.wind_kph} kph
                </Text>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      )}
      {errorMsg && <Text>{errorMsg}</Text>}
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    flex: 1,
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
  scrollContent: {
    alignContent: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
  more: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginTop: 32,
  },
});

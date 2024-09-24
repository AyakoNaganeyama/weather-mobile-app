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

const index = () => {
  const [location, setLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cityText, setCityText] = useState("");
  const [todayCast, setTodayCast] = useState([]);
  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();

  useEffect(() => {
    (async () => {
      // Ask for permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude, // Fixed the variable name
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        // Set the city name
        let cityName = reverseGeocode[0].city;
        // const today = new Date().toISOString().split('T')[0];

        async function getWeather() {
          const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`;

          // `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityName}`;
          const options = {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "b5ab53305emsh4d78561239fb906p1da757jsne5442cea8267",
              "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
            },
          };

          try {
            const response = await fetch(url, options);
            const result = await response.json();
            setCurrentCity(result);
            console.log("Current", result);

            //for 7 day forcast

            const currentEpoch = Math.floor(Date.now() / 1000); // Date.now()
            const forecastHours = result.forecast.forecastday[0].hour; // 24 hours forcast

            let forcast24 = [];

            // Define a range for comparison (e.g., within the same hour)
            let index = 0;

            const hourInSeconds = 3600; // 1 hour in seconds

            for (let i = 0; i < forecastHours.length; i++) {
              let hour = forecastHours[i];

              // Check if the hour time is within a 1-hour range of the current time
              if (Math.abs(hour.time_epoch - currentEpoch) <= hourInSeconds) {
                console.log("Matching hour found:", hour);

                index = i; // Store the index of the matched hour
                break; // Break out of the loop once a match is found
              }
            }

            console.log("Matched hour index:", index);

            for (let j = index; j < forecastHours.length; j++) {
              forcast24.push(forecastHours[j]);
            }

            let tomorrowForcast = 24 - forcast24.length;
            console.log(forcast24.length, tomorrowForcast);

            if (tomorrowForcast > 0) {
              for (let i = 0; i < tomorrowForcast; i++) {
                forcast24.push(result.forecast.forecastday[1].hour[i]);
              }
            }

            forcast24.forEach((hour) => {
              console.log(`Time: ${hour.time}, Temperature: ${hour.temp_c}°C`);
            });
            setTodayCast(forcast24);

            console.log(result);
          } catch (error) {
            console.error(error);
          }
        }

        getWeather();
      }
    })();
  }, []);

  const handleSearch = async () => {
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityText}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "b5ab53305emsh4d78561239fb906p1da757jsne5442cea8267",
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        setCity(result);
        console.log(result);

        //change to firebase ///////////////////////////////////////////////////

        const weatherData = {
          location: {
            name: result.location.name,
            region: result.location.region,
            country: result.location.country,
            lat: result.location.lat,
            lon: result.location.lon,
            tz_id: result.location.tz_id,
            localtime_epoch: result.location.localtime_epoch,
            localtime: result.location.localtime,
          },
          current: {
            last_updated_epoch: result.current.last_updated_epoch,
            last_updated: result.current.last_updated,
            temp_c: result.current.temp_c,
            temp_f: result.current.temp_f,
            is_day: result.current.is_day,
            wind_mph: result.current.wind_mph,
            wind_kph: result.current.wind_kph,
            wind_degree: result.current.wind_degree,
            wind_dir: result.current.wind_dir,
            pressure_mb: result.current.pressure_mb,
            pressure_in: result.current.pressure_in,
            precip_mm: result.current.precip_mm,
            precip_in: result.current.precip_in,
            humidity: result.current.humidity,
            cloud: result.current.cloud,
            feelslike_c: result.current.feelslike_c,
            feelslike_f: result.current.feelslike_f,
            windchill_c: result.current.windchill_c,
            windchill_f: result.current.windchill_f,
            heatindex_c: result.current.heatindex_c,
            heatindex_f: result.current.heatindex_f,
            dewpoint_c: result.current.dewpoint_c,
            dewpoint_f: result.current.dewpoint_f,
            vis_km: result.current.vis_km,
            vis_miles: result.current.vis_miles,
            uv: result.current.uv,
            gust_mph: result.current.gust_mph,
            gust_kph: result.current.gust_kph,
          },
        };

        const docRef = await addDoc(
          collection(firestore, "weatherData"),
          weatherData
        );
        console.log("Document written with ID: ", docRef.id);
        ///////////////////////////////////////////////////////////////////////

        // Store the city data to AsyncStorage
        // const jsonValue = await AsyncStorage.getItem("cities2");

        // let cities = [];

        // if (jsonValue != null) {
        //   cities = JSON.parse(jsonValue);
        // } else {
        //   cities = [];
        // }

        // Add the new Todo to the existing list (or to the empty array)
        // cities.push(result);

        //back object array to json string
        // const updatedJsonValue = JSON.stringify(cities);
        // Save the updated list back to AsyncStorage
        // await AsyncStorage.setItem("cities2", updatedJsonValue);

        // const returned = await AsyncStorage.getItem("cities2");
        // console.log("retuend Item", returned);
        setStoredCity(result);
        setCurrentCity(null);
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { getImage } = useGetImage();

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
            value={cityText}
            placeholderTextColor="gray"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSearch}
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

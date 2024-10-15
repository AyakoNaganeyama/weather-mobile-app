import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import useCityStore from "../stores/cityStore";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import useHandleSearch from "../hooks/useHandleSearch";
import Searched from "../(modals)/Searched";
import useHandleCityList from "../hooks/useHandleCityList";
import useBooleanStore from "../stores/isSearched";
import useGetImage from "../hooks/useGetImage";
import useAucklandWeather from "../stores/aucklandImageStore";

const Explore = () => {
  const { handleDelete, cities, fetchCityList } = useHandleCityList();
  const {
    initialSearch,

    currentCity,
    cityText,
    todayCast,
    errorMsg,
    handleSearch,
    setCityText, // So users can type the city name

    searchedCity,
    todayCast2,
    setSearchedCity,
  } = useHandleSearch();

  const { getImage } = useGetImage();

  const { storedCity, setStoredCity, clearStoredCity } = useCityStore();
  const { isActive } = useBooleanStore();
  const { storedAuckland, setStoredAuckland, clearStoredAuckland } =
    useAucklandWeather();

  useEffect(() => {
    fetchCityList();
  }, [storedCity]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: 20 }}>
          {/* Search Bar */}
          <View style={styles.container2}>
            <View style={styles.searchContainer2}>
              <GooglePlacesAutocomplete
                placeholder="Search City"
                fetchDetails={true}
                onPress={(data) => {
                  const cityName = data.description;
                  setCityText(cityName);
                }}
                query={{
                  key: "AIzaSyAMn-oW3pnCbuyRFnGmLX8a0NNEnWOPuhM",
                  language: "en",
                  types: "(cities)",
                }}
                textInputProps={{
                  style: styles.input2,
                }}
              />
              <TouchableOpacity
                onPress={handleSearch} // Call the hook's search function
                disabled={cityText === ""}
                style={[
                  styles.AddButton,
                  cityText === "" && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* If searchedCity exists, show the searched city's details */}
          {!isActive && searchedCity ? (
            <Searched data={searchedCity} />
          ) : /* If searchedCity is null, show the list of cities */
          cities.length > 0 ? (
            <ScrollView>
              {cities
                .filter((city) => city.location)
                .map((city, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 20,
                      backgroundColor: "rgba(80,80,80, 0.7)",

                      padding: 10,
                      borderRadius: 15,
                      height: 100,
                      marginVertical: 10,
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Link
                        href={`/Listings/${city.location.lat},${city.location.lon}`}
                      >
                        <Text style={styles.threeDay}>
                          {city.location.name}
                        </Text>
                      </Link>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          handleDelete(
                            city.location.name,
                            city.location.country
                          )
                        }
                        style={{ marginLeft: 10 }}
                      >
                        <Text style={styles.threeDay}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </ScrollView>
          ) : (
            <Text>No cities found.</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    flex: 1,
  },
  container2: {
    padding: 10,
  },
  searchContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  input2: {
    flex: 1,
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  AddButton: {
    backgroundColor: "#6c7cac",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: "#8e979e",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  threeDay: {
    color: "#fff",
    fontSize: 18,
  },
});

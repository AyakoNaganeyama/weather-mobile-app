import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import { useHandleCityList } from "@/hooks/useHandleCityList";
import { useHandleSearch } from "@/hooks/useHandleSearch";
import Searched from "../(modals)/Searched";
import useBooleanStore from "@/stores/isSearched";
import useCityStore from "@/stores/cityStore";

import { Loader } from "@/components/Loader";

// this page shows list of cities added to fire store by user, and renders searched city's weather information <Searched>.tsx
export default function Explore() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { handleDelete, cities, fetchCityList } = useHandleCityList();
  const {
    cityText,
    handleSearch,
    searchedCity,
    setCityText, // So users can type the city name
  } = useHandleSearch();
  const { storedCity } = useCityStore();
  const { isActive } = useBooleanStore();

  useEffect(() => {
    fetchData();
  }, [storedCity]);

  async function fetchData() {
    const response = await fetchCityList();

    if (response) setIsLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ marginTop: 20 }}>
            {/* Search Bar connected to google places */}
            <View style={styles.container2}>
              <View style={styles.searchContainer2}>
                <TextInput
                  style={styles.input2}
                  onChangeText={(text) => setCityText(text)}
                />

                <TouchableOpacity
                  onPress={handleSearch} // Call the hook's search function
                  disabled={cityText === ""}
                  style={[
                    styles.AddButton,
                    cityText === "" && styles.buttonDisabled,
                  ]}
                >
                  <Text
                    style={{ ...styles.buttonText, justifyContent: "flex-end" }}
                  >
                    Search
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* If searchedCity exists, show the searched city's details */}
            {!isActive && searchedCity ? (
              <Searched data={searchedCity} />
            ) : /* If searchedCity is null, show the list of cities user already added to fire store previsouly */
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
                          href={`../Listings/${city.location.lat},${city.location.lon}`}
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
      )}
    </View>
  );
}

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

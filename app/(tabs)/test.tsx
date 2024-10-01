import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useState } from "react";

const SearchCity = () => {
  const [city, setCity] = useState("");
  const handleSearch = () => {
    console.log(city);
  };
  return (
    <View style={styles.container2}>
      <View style={styles.searchContainer2}>
        <GooglePlacesAutocomplete
          placeholder="Search City"
          fetchDetails={true}
          onPress={(data, details = null) => {
            // Extract and log the city name
            const cityName = data.description;
            setCity(cityName);
          }}
          query={{
            key: "AIzaSyAMn-oW3pnCbuyRFnGmLX8a0NNEnWOPuhM",
            language: "en",
            types: "(cities)",
          }}
          textInputProps={{
            style: styles.input2, // Style for the input field
          }}
        />

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton2} onPress={handleSearch}>
          <Text style={styles.buttonText2}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    padding: 10,
    justifyContent: "center", // Center vertically
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
});

export default SearchCity;

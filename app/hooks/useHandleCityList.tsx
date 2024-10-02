import { View, Text } from "react-native";
import React from "react";
import { WeatherData } from "../types/forcastType";

const useDeteleCity = () => {
  const handleDelete = (city: string, country: string) => {
    console.log(city);
    console.log(country);
  };

  return { handleDelete };
};

export default useDeteleCity;

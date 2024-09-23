import { View, Text } from "react-native";
import React from "react";

const useGetImage = () => {
  const getImage = (conditionText: string, isDay: number) => {
    // lowercase the condition
    const lowerCaseCondition = conditionText.toLowerCase();

    // Choose images based on the condition and time of day

    if (isDay) {
      if (
        lowerCaseCondition.includes("sunny") ||
        lowerCaseCondition.includes("clear")
      ) {
        return require("../img/noon-sunny.webp"); // Daytime sunny image
      } else if (
        lowerCaseCondition.includes("cloudy") ||
        lowerCaseCondition.includes("overcast")
      ) {
        return require("../img/noon-cloudy.jpg"); // Noon cloudy
      } else if (
        lowerCaseCondition.includes("rain") ||
        lowerCaseCondition.includes("drizzle")
      ) {
        return require("../img/noon-rain.jpg"); // Noon rain
      } else {
        return require("../img/noon-sunny.webp"); // Default
      }
    } else {
      if (
        lowerCaseCondition.includes("sunny") ||
        lowerCaseCondition.includes("clear")
      ) {
        return require("../img/night-sunny.jpeg"); // night sunny
      } else if (
        lowerCaseCondition.includes("cloudy") ||
        lowerCaseCondition.includes("overcast")
      ) {
        return require("../img/night-cloudy.jpg"); // Night cloudy
      } else if (
        lowerCaseCondition.includes("rain") ||
        lowerCaseCondition.includes("drizzle")
      ) {
        return require("../img/night-rain.jpg"); // Night rain
      } else {
        return require("../img/night-sunny.jpeg"); //default
      }
    }

    // if (lowerCaseCondition.includes("sunny")) {
    //   if (isDay) {

    //     return require("../img/weather-noon-good.webp"); // Daytime sunny image
    //   } else {
    //     return require("../img/weather-night-good.jpeg"); // Nighttime sunny image
    //   }
    // } else if (
    //   lowerCaseCondition.includes("cloudy") ||
    //   lowerCaseCondition.includes("overcast")
    // ) {
    //   return require("../img/weather-cloudy.jpg"); // Cloudy or overcast image
    // } else if (
    //   lowerCaseCondition.includes("rain") ||
    //   lowerCaseCondition.includes("drizzle")
    // ) {
    //   return require("../img/weather-noon-rain.jpg"); // Rainy image
    // }

    // Default image if no match
  };
  return { getImage };
};

export default useGetImage;

import { View, Text } from "react-native";
import React from "react";

const useFrontEndLogic = () => {
  const checkUV = (n: number) => {
    if (n <= 2) {
      return "Low";
    } else if (n <= 5) {
      return "Moderate";
    } else if (n <= 7) {
      return "High";
    } else if (n <= 10) {
      return "Very High";
    } else {
      return "Extreme";
    }
  };

  const checkVisibility = (n: number) => {
    if (n <= 1) {
      return "Very poor";
    } else if (n <= 5) {
      return "Poor";
    } else if (n < 10) {
      ("Moderate");
    } else {
      return "Clear";
    }
  };

  const checkFeelsLike = (n: number) => {
    if (n <= 0) {
      return "Feels freezing";
    } else if (n <= 9.9) {
      return "Feels chilly";
    } else if (n <= 19.9) {
      return "Feels cool";
    } else if (n <= 29.9) {
      return "Feels warm and comfortable";
    } else {
      return "Feels hot";
    }
  };

  const checkHumidity = (n: number) => {
    if (n < 30) {
      return "Dry";
    } else if (n <= 59.9) {
      return "Comfortable";
    } else if (n <= 79.9) {
      return "Noticeable Humidity";
    } else {
      return "Very Humid";
    }
  };

  const checkWind = (n: number) => {
    if (n < 15) {
      return "Light and Calm";
    } else if (n <= 29.9) {
      return "Gentle Breeze";
    } else if (n <= 49.9) {
      return "Breezy";
    } else {
      return "Strong Wind";
    }
  };

  const checkCloud = (n: number) => {
    if (n < 20) {
      return "Clear";
    } else if (n <= 49.9) {
      return "Some Cloud";
    } else if (n <= 79.9) {
      return "Partly Cloudy";
    } else {
      return "Overcast";
    }
  };

  return {
    checkUV,
    checkVisibility,
    checkFeelsLike,
    checkHumidity,
    checkWind,
    checkCloud,
  };
};

export default useFrontEndLogic;

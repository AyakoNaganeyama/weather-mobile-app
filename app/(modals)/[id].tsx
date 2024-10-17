import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Button,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import useGetImage from "../hooks/useGetImage";
import useShare from "../hooks/useShare";

//this page is only if we want detail page for each information of the city (each information desplayed is touchableOpacity but maybe we dont need that far)

const Page = () => {
  const { id } = useLocalSearchParams<{ id: any }>();
  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
};

export default Page;

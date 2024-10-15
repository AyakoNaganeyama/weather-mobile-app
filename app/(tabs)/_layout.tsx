import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const Layout = () => {
  return (
    //
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }}></Tabs.Screen>
      <Tabs.Screen
        name="explore"
        options={{ headerShown: false }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default Layout;

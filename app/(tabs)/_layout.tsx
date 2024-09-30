import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const Layout = () => {
  return (
    //
    <Tabs>
      <Tabs.Screen name="index"></Tabs.Screen>
      <Tabs.Screen name="explore"></Tabs.Screen>
    </Tabs>
  );
};

export default Layout;

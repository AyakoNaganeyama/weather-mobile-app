import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // hides the top header for all tabs
      }}
      tabBar={(props) => <TabBar {...props} />} // custom bottom bar
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}

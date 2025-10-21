import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

export default function Layout() {
  return (
    // passing props for styling for bottom tab bar
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="explore" options={{ headerShown: false }} />
    </Tabs>
  );
}

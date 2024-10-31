import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'

const Layout = () => {
	return (
		// passing props for styling for bottom tab bar
		<Tabs tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen name='index' options={{ headerShown: false }}></Tabs.Screen>
			<Tabs.Screen
				name='explore'
				options={{ headerShown: false }}
			></Tabs.Screen>
		</Tabs>
	)
}

export default Layout

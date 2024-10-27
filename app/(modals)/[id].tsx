import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

//this page is only if we want detail page for each information of the city (each information desplayed is touchableOpacity but maybe we dont need that far)

const Page = () => {
	const { id } = useLocalSearchParams<{ id: any }>()
	return (
		<View>
			<Text>{id}</Text>
		</View>
	)
}

export default Page

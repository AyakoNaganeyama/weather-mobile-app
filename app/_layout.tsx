import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	})

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return <RootLayoutNav />
}

function RootLayoutNav() {
	const router = useRouter()
	return (
		<Stack>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			<Stack.Screen
				name='(modals)/Searched'
				options={{
					headerTitle: '',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name='close-outline' size={28} />
						</TouchableOpacity>
					),
					animation: 'fade',
				}}
			/>

			<Stack.Screen
				name='listings/[id]'
				options={{
					headerTitle: 'Details',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name='close-outline' size={28} />
						</TouchableOpacity>
					),
					animation: 'fade',
				}}
			/>
		</Stack>
	)
}

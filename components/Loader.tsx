import { ActivityIndicator, View } from 'react-native'

export function Loader() {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
			<ActivityIndicator size={'large'} />
		</View>
	)
}

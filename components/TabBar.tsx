import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'

// Define the keys for your icons to match route names
type IconKey = 'index' | 'explore'

const icon: Record<IconKey, (props: any) => JSX.Element> = {
	index: (props) => <FontAwesome5 name='location-arrow' size={24} {...props} />,
	explore: (props) => <Ionicons name='reorder-three' size={24} {...props} />,
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
	return (
		<View style={styles.tabbar}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key]
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name

				const isFocused = state.index === index

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					})

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params)
					}
				}

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					})
				}

				// Type assertion to ensure route.name matches the icon key
				const IconComponent = icon[route.name as IconKey]

				return (
					<TouchableOpacity
						key={route.key}
						accessibilityRole='button'
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.tabbarItem}
					>
						<IconComponent
							color={isFocused ? 'white' : 'rgba(211, 211, 211, 0.6)'}
						/>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	tabbar: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'rgba(80,80,80, 1)',
		borderRadius: 30,
		marginBottom: 10,
		marginHorizontal: 80,
	},
	tabbarItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 5,
		paddingVertical: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
	},
})

export function covertToDay(d: any) {
	const date = new Date(d)
	const options: Intl.DateTimeFormatOptions = { weekday: 'long' } // Correct type for 'weekday'
	const dayOfWeek = date.toLocaleDateString('en-US', options)
	if (dayOfWeek.toLowerCase() == 'monday') {
		return 'Mon'
	} else if (dayOfWeek.toLowerCase() == 'tuesday') {
		return 'Tue'
	} else if (dayOfWeek.toLowerCase() == 'wednesday') {
		return 'Wed'
	} else if (dayOfWeek.toLowerCase() == 'thursday') {
		return 'Thu'
	} else if (dayOfWeek.toLowerCase() == 'friday') {
		return 'Fri'
	} else if (dayOfWeek.toLowerCase() == 'saturday') {
		return 'Sat'
	} else if (dayOfWeek.toLowerCase() == 'sunday') {
		return 'Sun'
	} else {
		return dayOfWeek
	}
}

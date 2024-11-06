import { convertHours } from '../convertHours'

describe('convertHours unit test', () => {
	it('convert time_epoch to AM/PM format', () => {
		const currentEpochTime = Math.floor(Date.now() / 1000) // convert date into seconds

		const mockData: any[] = [
			{
				time_epoch: currentEpochTime,
				location: { tz_id: 'Pacific/Auckland' },
			},
		]

		// run convertHours function then store result
		const result = convertHours(mockData, 'Pacific/Auckland')[0].time_epoch

		// result should now match AM/PM format (e.g. "hh:mm am/pm")
		expect(result).toMatch(/^\d{2}:\d{2} (am|pm)$/)
	})
})

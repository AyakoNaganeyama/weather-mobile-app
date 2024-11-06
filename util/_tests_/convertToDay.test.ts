import { covertToDay } from '../convertToDay'

describe('covertToDay unit test', () => {
	test('convert date format into day of the week example Mon', () => {
		expect(covertToDay('2024-11-04')).toBe('Mon')
		expect(covertToDay('2024-11-05')).toBe('Tue')
		expect(covertToDay('2024-11-06')).toBe('Wed')
		expect(covertToDay('2024-11-07')).toBe('Thu')
		expect(covertToDay('2024-11-08')).toBe('Fri')
		expect(covertToDay('2024-11-09')).toBe('Sat')
		expect(covertToDay('2024-11-10')).toBe('Sun')
	})
})

import { create } from 'zustand'

// This is for show or not show add button to firebase in Searched page
interface BooleanStoreState {
	isExist: boolean
	setTrue2: () => void
	setFalse2: () => void
}

const useIsExist = create<BooleanStoreState>((set) => ({
	isExist: false, // Initial state is false
	setTrue2: () => set({ isExist: true }), // Set to true
	setFalse2: () => set({ isExist: false }), // Set to false
}))

export default useIsExist

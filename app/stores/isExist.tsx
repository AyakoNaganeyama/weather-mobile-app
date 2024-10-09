import { create } from "zustand";

// Define the type for the store state
interface BooleanStoreState {
  isExist: boolean;
  setTrue2: () => void;
  setFalse2: () => void;
}

// Create the Zustand store
const useIsExist = create<BooleanStoreState>((set) => ({
  isExist: false, // Initial state is false
  setTrue2: () => set({ isExist: true }), // Set to true
  setFalse2: () => set({ isExist: false }), // Set to false
}));

export default useIsExist;

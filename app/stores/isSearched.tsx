import { create } from "zustand";

// Define the type for the store state
interface BooleanStoreState {
  isActive: boolean;
  setTrue: () => void;
  setFalse: () => void;
}

// Create the Zustand store
const useBooleanStore = create<BooleanStoreState>((set) => ({
  isActive: false, // Initial state is false
  setTrue: () => set({ isActive: true }), // Set to true
  setFalse: () => set({ isActive: false }), // Set to false
}));

export default useBooleanStore;

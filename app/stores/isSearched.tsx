import { create } from "zustand";

// this is for weather to display or not display <Searched>.tsx in explore
interface BooleanStoreState {
  isActive: boolean;
  setTrue: () => void;
  setFalse: () => void;
}

const useBooleanStore = create<BooleanStoreState>((set) => ({
  isActive: false, // Initial state is false
  setTrue: () => set({ isActive: true }), // Set to true
  setFalse: () => set({ isActive: false }), // Set to false
}));

export default useBooleanStore;

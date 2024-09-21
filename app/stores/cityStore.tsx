import { create } from "zustand";

// Define the CityState interface
interface CityState {
  storedCity: {
    name: string;
    region: string;
    country: string;
    temp_c: number;
    condition: string;
  } | null;
  setStoredCity: (city: {
    name: string;
    region: string;
    country: string;
    temp_c: number;
    condition: string;
  }) => void;
  clearStoredCity: () => void;
}

// Create the Zustand store for city data
const useCityStore = create<CityState>((set) => ({
  storedCity: null, // Initial state
  setStoredCity: (storedCity) => set({ storedCity }), // Set city data
  clearStoredCity: () => set({ storedCity: null }), // Clear city data
}));

export default useCityStore;

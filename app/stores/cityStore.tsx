import { create } from "zustand";

// Define the CityState interface with location, current, and forecast data
interface CityState {
  storedCity: {
    location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime_epoch: number;
      localtime: string;
    };
    current: {
      temp_c: number;
      temp_f: number;
      condition: {
        text: string;
        icon: string;
      };
      wind_kph: number;
      wind_mph: number;
      humidity: number;
      feelslike_c: number;
      feelslike_f: number;
      vis_km: number;
      vis_miles: number;
      gust_kph: number;
      gust_mph: number;
      uv: number;
    };
    forecast: {
      forecastday: Array<{
        date: string;
        day: {
          maxtemp_c: number;
          maxtemp_f: number;
          mintemp_c: number;
          mintemp_f: number;
          avgtemp_c: number;
          avgtemp_f: number;
          daily_will_it_rain: number;
          daily_chance_of_rain: number;
        };
        hour: Array<{
          time_epoch: number;
          temp_c: number;
          temp_f: number;
          condition: {
            text: string;
            icon: string;
          };
          wind_kph: number;
          wind_mph: number;
        }>;
      }>;
    };
  } | null;
  setStoredCity: (city: {
    location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime_epoch: number;
      localtime: string;
    };
    current: {
      temp_c: number;
      temp_f: number;
      condition: {
        text: string;
        icon: string;
      };
      wind_kph: number;
      wind_mph: number;
      humidity: number;
      feelslike_c: number;
      feelslike_f: number;
      vis_km: number;
      vis_miles: number;
      gust_kph: number;
      gust_mph: number;
      uv: number;
    };
    forecast: {
      forecastday: Array<{
        date: string;
        day: {
          maxtemp_c: number;
          maxtemp_f: number;
          mintemp_c: number;
          mintemp_f: number;
          avgtemp_c: number;
          avgtemp_f: number;
          daily_will_it_rain: number;
          daily_chance_of_rain: number;
        };
        hour: Array<{
          time_epoch: number;
          temp_c: number;
          temp_f: number;
          condition: {
            text: string;
            icon: string;
          };
          wind_kph: number;
          wind_mph: number;
        }>;
      }>;
    };
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

// useShare.ts
import React from "react";
import { Alert, Share } from "react-native";
// sharing service
const useShare = () => {
  const onShare = async (city: any) => {
    try {
      // to ensure city and its necessary fields are available
      if (!city || !city.location || !city.current) {
        Alert.alert("City data is not available for sharing.");
        return;
      }

      const mapLink = `https://www.google.com/maps/@${city.location.lat},${city.location.lon},12z`;
      // Formatting the message with the city details
      const message = `
      React Native | A framework for building native apps using React.
      Current location details:
      City: ${city.location.name}
      Region: ${city.location.region || "N/A"}
      Country: ${city.location.country}
      Latitude: ${city.location.lat}
      Longitude: ${city.location.lon}
      Timezone: ${city.location.tz_id}
      Local Time: ${city.location.localtime}
      Temperature: ${city.current.temp_c}°C / ${city.current.temp_f}°F
      Condition: ${city.current.condition.text || "N/A"}
      Map Location: ${mapLink}
    `;

      // Share the formatted message
      const result = await Share.share({ message }, { mapLink });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared successfully
        }
      } else if (result.action === Share.dismissedAction) {
        // Share dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return { onShare };
};

export default useShare;

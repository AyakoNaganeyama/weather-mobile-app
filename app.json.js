import 'dotenv/config';
export default {

  "expo": {
    "name": "weather-updated",
    "slug": "weather-updated",
    "version": "1.2.2",
    "newArchEnabled": true,
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Allow weatherApp to access your location to show local weather."
      },
      "bundleIdentifier": "com.multiahfoon.weatherupdated"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "package": process.env.EXPO_PUBLIC_BUNDLE_IDENTIFIER
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow weatherApp to use your location to show the weather."
        }
      ],
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": process.env.EXPO_PUBLIC_PROJECT_ID
      }
    },
    "owner": process.env.EXPO_PUBLIC_OWNER,
    "updates": {
      "url": process.env.EXPO_PUBLIC_URL
    }

}}

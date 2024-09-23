// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwx7RZruIv4C-pFfTDp2MEB-xjGsy7ih8",
  authDomain: "weather-app-updated.firebaseapp.com",
  projectId: "weather-app-updated",
  storageBucket: "weather-app-updated.appspot.com",
  messagingSenderId: "719386058797",
  appId: "1:719386058797:web:fb0394a7fa337bde9018a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {app,auth,firestore,storage}
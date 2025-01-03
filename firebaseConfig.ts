// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from 'firebase/app'

import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREAPIKEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDIMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEB,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGEID,
  appId: process.env.EXPO_PUBLIC_APPID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const storage = getStorage(app)

export { app, firestore, storage }

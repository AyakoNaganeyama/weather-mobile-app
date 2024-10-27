// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyB2Gf7cl-eBWLBgBNSPBaiIceOE4FfcnmU',
	authDomain: 'weather-app-demo-f462a.firebaseapp.com',
	projectId: 'weather-app-demo-f462a',
	storageBucket: 'weather-app-demo-f462a.appspot.com',
	messagingSenderId: '550010739355',
	appId: '1:550010739355:web:f7c52a63f4688d2a34843e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage(app)

export { app, auth, firestore, storage }

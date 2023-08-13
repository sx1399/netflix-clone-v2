// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAUqMJpiEA0zibblyU3DNZow0Hbdjwy-c",
  authDomain: "netflix-clone-a9aed.firebaseapp.com",
  projectId: "netflix-clone-a9aed",
  storageBucket: "netflix-clone-a9aed.appspot.com",
  messagingSenderId: "630654055380",
  appId: "1:630654055380:web:7fc34331add5586abb1c41",
  measurementId: "G-MV2YFKDG62"
}
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }

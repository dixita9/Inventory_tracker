// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCyIknorIkbwapASlSKD9qvWAU2fdCCJJ8",
  authDomain: "inventory-management-81f13.firebaseapp.com",
  projectId: "inventory-management-81f13",
  storageBucket: "inventory-management-81f13.appspot.com",
  messagingSenderId: "536483361677",
  appId: "1:536483361677:web:a160c0894a3202fa7e83c4",
  measurementId: "G-LEFE0R6T17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
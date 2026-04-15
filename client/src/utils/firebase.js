/* eslint-disable no-unused-vars */

import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewarc.firebaseapp.com",
  projectId: "interviewarc",
  storageBucket: "interviewarc.firebasestorage.app",
  messagingSenderId: "158324421377",
  appId: "1:158324421377:web:9b76961a70616eb688a100"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth, provider}
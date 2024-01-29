import { initializeApp } from 'firebase/app';
import {getAnalytics} from 'firebase/analytics'
const firebaseConfig = {
  apiKey: "AIzaSyCCe83m66Rp9wUAzV95SbpLSmqixI-7YMo",
  authDomain: "chat-app-1c20e.firebaseapp.com",
  projectId: "chat-app-1c20e",
  storageBucket: "chat-app-1c20e.appspot.com",
  messagingSenderId: "457338039046",
  appId: "1:457338039046:web:e87f5facd3cbde0f164c87",
  measurementId: "G-D9TZLWNN8H"
};

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBn66T9NLGSgFRcq1lW7mXRoh8fxEOLk-U",
  authDomain: "react19-a1287.firebaseapp.com",
  databaseURL: "https://react19-a1287-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react19-a1287",
  storageBucket: "react19-a1287.firebasestorage.app",
  messagingSenderId: "448679722959",
  appId: "1:448679722959:web:eafb5e6ff43f87c8551cba"
};

export const app = initializeApp(firebaseConfig);
export const dataBase = getDatabase(app);
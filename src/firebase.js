// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDKWQQY-t_I1yjGMbEzZYnqYeSSpwXkPhs",
  authDomain: "share-comment.firebaseapp.com",
  databaseURL: "https://share-comment.firebaseio.com",
  projectId: "youtube-share-comment",
  storageBucket: "youtube-share-comment.appspot.com",
  messagingSenderId: "948370993873",
  appId: "1:948370993873:web:9591015a456e8193af4bf0",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

try {
  let app = firebase.app();
  let features = ["auth", "database", "messaging", "storage"].filter(
    (feature) => typeof app[feature] === "function"
  );
  document.getElementById(
    "load"
  ).innerHTML = `Firebase SDK loaded with ${features.join(", ")}`;
} catch (e) {
  console.error(e);
  document.getElementById("load").innerHTML =
    "Error loading the Firebase SDK, check the console.";
}

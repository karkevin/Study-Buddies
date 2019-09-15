//import "firebase/firestore";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
//const firebase = require("firebase/firestore");
const express = require("express");
const cors = require("cors");
const app = express();

admin.initializeApp({
  apiKey: "AIzaSyBfIJepO-QXe8-M_fKFObdFxlHCclggmjE",
  authDomain: "studywithme-a94ce.firebaseapp.com",
  projectId: "studywithme"
});

const db = admin.firestore();

//app.get("/test", (req, res) => {
exports.test = functions.https.onRequest((req, res) => {
  console.log("testing api");
  db.collection("users").add({
    "full name": "Bill",
    age: 20
  });
  res.send({
    test: 1
  });
});

exports.login = functions.https.onRequest();

// });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//exports.api = functions.https.onRequest(app);

// import dependencies
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

// authoirze with firebase
admin.initializeApp({
  apiKey: "AIzaSyBfIJepO-QXe8-M_fKFObdFxlHCclggmjE",
  authDomain: "studywithme-a94ce.firebaseapp.com",
  projectId: "studywithme"
});

// initialize firestore database
const db = admin.firestore();

app.get("/test", (req, res) => {
  console.log("testing api");
  db.collection("users").add({
    "full name": "Bill",
    age: 20
  });
  res.send({
    test: 1
  });
});

// endpoint handling log in requests
app.post("/login", (req, res) => {
  const username = req.username;
  const profile = db.collection("users").doc(username);
  profile.get().then(user => {
    if (user.exists) {
      if (user.data().password == req.password) {
        res.send({
          message: "Signed in"
        });
      } else {
        res.send({
          message: "Incorrect password"
        });
      }
    } else {
      res.send({
        message: "This user does not exist"
      });
    }
  });
});

// });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.api = functions.https.onRequest(app);

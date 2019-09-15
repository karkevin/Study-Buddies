// import dependencies
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// authoirze with firebase
admin.initializeApp({
  apiKey: "AIzaSyBfIJepO-QXe8-M_fKFObdFxlHCclggmjE",
  authDomain: "studywithme-a94ce.firebaseapp.com",
  projectId: "studywithme"
});

// initialize firestore database
const db = admin.firestore();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

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

app.get("/test2", (req, res) => {
  res.send("hello");
});

// endpoint handling log in requests
app.post("/login", (req, res) => {
  const username = req.body.username;
  const profile = db.collection("users").doc(username);
  profile.get().then(user => {
    if (user.exists) {
      if (user.data().password == req.body.password) {
        res.send({
          userExists: true,
          loginSuccessful: true
        });
      } else {
        res.json({
          userExists: true,
          loginSuccessful: false
        });
      }
    } else {
      res.json({
        userExists: false,
        loginSuccessful: false
      });
    }
  });
});

app.put("/editProfile", (req, res) => {
  const profile = db.collection("users").doc(req.body.userid);
  profile.get.then(user => {
    user.array.forEach(element => {
      user.update({
        bio: req.body.bio,
        courses: req.body.courses,
        email: req.body.email,
        interests: req.body.interests,
        picture: req.body.picture
      });
    });
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

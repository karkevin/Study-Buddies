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
app.use(cors());

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
  const username = req.body.userid;
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
          loginSuccessful: false,
          userid: username
        });
      }
    } else {
      res.json({
        userExists: false,
        loginSuccessful: false,
        userid: username
      });
    }
  });
});

app.post("/profileInfo", (req, res) => {
  const profile = db.collection("users").doc(req.body.userid);
  profile.get().then(user => {
    if (!user.exists) {
      res.send({});
    } else {
      res.send({
        courses: user.data().courses,
        bio: user.data().bio,
        interests: user.data().interests,
        picture: user.data().picture
      });
    }
  });
});

app.put("/editProfile", (req, res) => {
  const profile = db.collection("users").doc(req.body.userid);
  profile.get().then(user => {
    if (user.exists) {
      let interestArray = req.body.interests.split(",");
      for (let i = 0; i < interestArray.length; i++) {
        interestArray[i] = interestArray[i].trim();
      }
      let coursesArray = req.body.courses.split(",");
      for (let i = 0; i < coursesArray.length; i++) {
        coursesArray[i] = coursesArray[i].trim();
      }
      profile
        .set({
          bio: req.body.bio,
          courses: coursesArray,
          email: req.body.email,
          interests: interestArray,
          picture: req.body.picture
        })
        .then(result => {
          res.send({
            updated: true
          });
        });
    } else {
      res.send({
        updated: false
      });
    }
  });
});

app.get("/match", (req, res) => {});

app.post("/addUser", (req, res) => {
  // does not add profile if userid exists already
  const users = db.collection("users");
  //for (let i=0; i < users.length; i++){
  //   users[i] = users[i].trim()
  //}
  users
    .doc(req.body.userid)
    .get()
    .then(user => {
      if (user.exists) {
        res.send({
          idTaken: true,
          userCreated: false
        });
      } else {
        let interestArray = req.body.interests.split(",");
        for (let i = 0; i < interestArray.length; i++) {
          interestArray[i] = interestArray[i].trim();
        }
        let coursesArray = req.body.courses.split(",");
        for (let i = 0; i < coursesArray.length; i++) {
          coursesArray[i] = coursesArray[i].trim();
        }
        users.doc(req.body.userid).set({
          userid: req.body.userid,
          name: req.body.name,
          password: req.body.password,
          bio: req.body.bio,
          interests: interestArray,
          courses: coursesArray,
          email: req.body.email,
          picture: req.body.picture
        });
        users
          .doc(req.body.userid)
          .collection("matches")
          .add({
            profile: db.doc("users/" + req.body.userid)
          })
          .then(result => {
            res.send(result => {
              res.send({
                idTaken: false,
                userCreated: true
              });
            });
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

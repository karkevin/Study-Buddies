// import dependencies
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
var URL = require("url").URL;

let path = "/text/analytics/v2.1/keyPhrases";
const endpoint = "https://karkackev.cognitiveservices.azure.com/";
let userKeyPhrases = [];

let response_handler = function(response) {
  let body = "";
  response.on("data", function(d) {
    body += d;
  });
  response.on("end", function() {
    let body_ = JSON.parse(body);
    userKeyPhrases = body_.documents[0].keyPhrases;
    var matched = keywords(userKeyPhrases);
    db.collection("users")
      .doc(userId)
      .collection("matches")
      .doc("profiles")
      .set({
        users: matched
      });
  });
  response.on("error", function(e) {
    console.log("Error: " + e.message);
  });
};

let get_key_phrases = function(documents) {
  let body = JSON.stringify(documents);

  let request_params = {
    method: "POST",
    hostname: new URL(endpoint).hostname,
    path: path,
    headers: {
      "Ocp-Apim-Subscription-Key": subscription_key
    }
  };

  let req = https.request(request_params, response_handler);
  req.write(body);
  req.end();
};

const subscription_key = "bb76c73bafe3405484cd01c6af0ee732";

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
        picture: user.data().picture,
        name: user.data().name,
        email: user.data().email
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

app.post("/match", (req, res) => {
  // Mock data
  // var userText = {
  //   bio:
  //     "Hi guys! My name is Dave, and I like to hack!! My favorite course is CS246, and I love traveling. Please message me if you want to study :)",
  //   courses: ["CS246", "ECO101", "DA223"],
  //   email: "davey@hack.com",
  //   interests: ["Coding", "Hacking", "Bubble Tea", "Sleeping", "Basketball"],
  //   picture: "Resources/Dave"
  // };

  const user = req.body.userid;
  const profile = db.collection("users").doc(user);
  const keywords = profile.data().keyWords;

  let keywordDict = {};

  for (let word of keywords) {
    testData[word] = db
      .collection("keywords")
      .doc(word)
      .data().users;
  }

  let userProfile = {
    bio: profile.data().bio,
    interests: profile.data().interests
  };

  // var testData = {
  //   Sleeping: ["Alice", "Bob", "Nicole"],
  //   Debate: ["Joe", "Bob", "Cooper"],
  //   Basketball: ["Alice", "Bob", "Joe"],
  //   Painting: ["Alice", "Nicole"],
  //   Volunteer: ["Bob", "Joe", "Nicole"],
  //   Coding: ["Bob", "Zaid", "Cooper"]
  // };

  /**
   * Gets the matched users from database based on keywords.
   */

  getMatchedUsers(JSON.stringify(userProfile), profile.data().userid);

  matchedUsers = profile
    .collection("matches")
    .doc("profiles")
    .data().users;
  matchArray = [];
  for (let user of matchedUsers) {
    profileData = db
      .collection("users")
      .doc(user)
      .data();
    userProfile = {
      name: profileData.name,
      bio: profileData.bio,
      courses: profileData.courses,
      interests: profileData.interests,
      picture: profileData.picture
    };
    matchArray.push(userProfile);
  }
  res.send({
    matches: matchArray
  });
});

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
          .doc("profiles")
          .set({
            users: [db.doc("users/" + req.body.userid)]
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

function keywords(phrases) {
  var matchedUsers = {};
  var matchedList = [];
  for (var obj of phrases) {
    if (testData.hasOwnProperty(obj)) {
      for (var user of testData[obj]) {
        if (matchedUsers.hasOwnProperty(user)) {
          matchedUsers[user] += 1;
        } else {
          matchedUsers[user] = 1;
        }
      }
    }
  }

  for (let user of matchedUsers) {
    if (matchedList.length == 0) {
      matchedList.push(user);
    } else {
      var i;
      for (i = 0; i < matchedList.length; i++) {
        if (matchedUsers[user] > matchedUsers[matchedList[i]]) {
          matchedList.splice(i, 0, user);
          break;
        }
      }
      if (i == matchedList.length) {
        matchedList.push(user);
      }
    }
  }
  return matchedList;
}

function getMatchedUsers(userText, userId) {
  var inputDocuments = {
    documents: [
      {
        language: "en",
        id: "1",
        text: userText
      }
    ]
  };
  get_key_phrases(inputDocuments);
}

exports.api = functions.https.onRequest(app);

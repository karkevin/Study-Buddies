// import dependencies
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Import dependencies for Azure
const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
// const key_var = 'TEXT_ANALYTICS_SUBSCRIPTION_KEY';
// if (!process.env[key_var]) {
//     throw new Error('please set/export the following environment variable: ' + key_var);
// }
const subscription_key = "bb76c73bafe3405484cd01c6af0ee732";

// const endpoint_var = 'TEXT_ANALYTICS_ENDPOINT';
// if (!process.env[endpoint_var]) {
//     throw new Error('please set/export the following environment variable: ' + endpoint_var);
// }
const endpoint = "https://karkackev.cognitiveservices.azure.com/";
const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const client = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);

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

app.get("/match", (req, res) => {
  // Mock data
  var userText = {
    bio: "Hi guys! My name is Dave, and I like to hack!! My favorite course is CS246, and I love traveling. Please message me if you want to study :)",
    courses: ["CS246", "ECO101", "DA223"],
    email: "davey@hack.com",
    interests: ["Coding", "Hacking", "Bubble Tea", "Sleeping", "Basketball"],
    picture: "Resources/Dave"
  }
  function deleteFields() {
    delete userText.courses;
    delete userText.email;
    delete userText.picture;
  } deleteFields();

  var testData = {
    "Sleeping": ["Alice", "Bob", "Nicole"],
    "Debate": ["Joe", "Bob", "Cooper"],
    "Basketball": ["Alice", "Bob", "Joe"],
    "Painting": ["Alice", "Nicole"],
    "Volunteer": ["Bob", "Joe", "Nicole"],
    "Coding": ["Bob", "Zaid", "Cooper"]
  }


  /**
  * Gets the matched users from database based on keywords. 
  */
  function getMatchedUsers(userText) {
    var userKeyPhrases = [];
    var inputDocuments = {
      documents: [
        {
          language: "en",
          id: "1",
          text: userText
        },
      ]
    }
    var condition = client.keyPhrases({
      multiLanguageBatchInput: inputDocuments
    });

    condition
      .then(result => {
        userKeyPhrases = result.documents[0].keyPhrases;
        var matched = keywords(userKeyPhrases);
        console.log(matched);

        // TODO upload to database.
      })
      .catch(err => {
        throw err;
      });
  }

  function keywords(phrases) {
    var matchedUsers = {};
    var matchedList = [];
    for (var obj of phrases) {
      if (testData.hasOwnProperty(obj)) {
        for (var user of testData[obj]) {
          if (matchedUsers.hasOwnProperty(user)) {
            matchedUsers[user] += 1;
          }
          else {
            matchedUsers[user] = 1;
          }
        }
      }
    }

    for (var user in matchedUsers) {
      if (matchedList.length == 0) {
        matchedList.push(user);
      }
      else {
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

  getMatchedUsers(JSON.stringify(userText));
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

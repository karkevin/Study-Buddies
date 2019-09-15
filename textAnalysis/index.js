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


// TEXTANALYTICSCLIENT
const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const client = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);


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
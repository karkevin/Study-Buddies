document.body.onload = addProfiles(initializeProfiles);
var profiles;
var currentProfileIndex = 0;

function addProfiles(callback) {
    var lst = [
        {
            "picture": "Resources/Sherry.jpeg",
            "name": "Sherry Sanders",
            "interests": ["Painting", "Ballet", "Environmental Sciences", "Design", "Ski"],
            "courses": ["ECO101", "ECO102", "CSC108", "ANT199"]
        },
        {
            "picture": "Resources/Bob.jpg",
            "name": "Bob Ding",
            "interests": ["Basketball", "Climbing", "Sleeping", "Coding", "Hiking"], 
            "courses": ["CSC207", "CSC209", "CSC236", "HPS101"]
        }
    ]

    var profilesDiv = document.createElement("div");
    profilesDiv.style.marginBottom = "100px";
    
    for (var i = 0; i < lst.length; i++) {
        var JSONObject = lst[i];
        console.log(lst[i]);
        var newDiv = document.createElement("div");
        var imageAndName = document.createElement("div");

        var image = document.createElement("img");
        image.src = JSONObject.picture;
        imageAndName.appendChild(image);
        imageAndName.appendChild(document.createTextNode(JSONObject.name));
        imageAndName.classList.add("personal");
        newDiv.appendChild(imageAndName);

        var courses = document.createElement("div");
        var courseText = document.createElement("h3");
        courseText.innerHTML = "Courses";
        courses.appendChild(courseText);
        var list = document.createElement('ul');
        for (var j = 0; j < JSONObject.courses.length; j++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(JSONObject.courses[j]));
            list.appendChild(item);
        }
        courses.appendChild(list);
        courses.classList.add("courses");
        newDiv.appendChild(courses);

        var interests = document.createElement("div");
        var interestsText = document.createElement("h3");
        interestsText.innerHTML = "Intersts";
        interests.appendChild(interestsText);
        var list = document.createElement('ul');
        for (var k = 0; k < JSONObject.interests.length; k++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(JSONObject.interests[k]));
            list.appendChild(item);
        }
        interests.appendChild(list);
        interests.classList.add("interests");
        newDiv.appendChild(interests);

        newDiv.classList.add("profile");
        profilesDiv.appendChild(newDiv);
    }
    document.body.insertBefore(profilesDiv, document.querySelector("footer"));
    callback();
}

function initializeProfiles() {
    profiles = document.querySelectorAll(".profile");
    // console.log(profiles);
}

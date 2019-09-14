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
    var currentDiv = document.querySelector("footer");

    for (var i = lst.length - 1; i >= 0; i--) {
        var object = lst[i];
        var newDiv = document.createElement("div");
        var imageAndName = document.createElement("div");

        var image = document.createElement("img");
        image.src = object.picture;
        imageAndName.appendChild(image);
        imageAndName.appendChild(document.createTextNode(object.name));
        imageAndName.classList.add("personal");
        newDiv.appendChild(imageAndName);

        var courses = document.createElement("div");
        var courseText = document.createElement("h3");
        courseText.innerHTML = "Courses";
        courses.appendChild(courseText);
        var list = document.createElement('ul');
        for (var i = 0; i < object.courses.length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(object.courses[i]));
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
        for (var i = 0; i < object.interests.length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(object.interests[i]));
            list.appendChild(item);
        }
        interests.appendChild(list);
        interests.classList.add("interests");
        newDiv.appendChild(interests);

        newDiv.classList.add("profile");
        document.body.insertBefore(newDiv, currentDiv);
        currentDiv = newDiv;
    }
    callback();
}

function initializeProfiles() {
    profiles = document.querySelectorAll(".profile");
    console.log(profiles);
}

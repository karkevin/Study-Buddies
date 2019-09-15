window.addEventListener('load', async () => {
  class User {
    /**
     * Creates a new User.
     * @param {string} picture The path to the picture.
     * @param {string} name The user's name.
     * @param {string[]} interests The user's interests.
     * @param {string[]} courses The users courses.
     */
    constructor(picture, name, interests, courses) {
      this.picture = picture;
      this.name = name;
      this.interests = interests;
      this.courses = courses;
    }

    static fromJson(json) {
      return new User(json['picture'], json['name'], json['interests'], json['courses']);
    }
  }

  /**
   * Displays the user's profile information.
   * @param {User} user The user.
   */
  function displayUser(user) {
    const profilePictureElement = document.getElementById("profile-picture");
    profilePictureElement.src = user.picture;

    const profileNameElement = document.getElementById("profile-name");
    profileNameElement.innerHTML = user.name;

    const profileInterestsElement = document.getElementById("profile-interests");
    profileInterestsElement.innerHTML = user.interests.join(", ");

    const profileCoursesElement = document.getElementById("profile-courses");
    profileCoursesElement.innerHTML = user.courses.join(", ");
  }

  let user;
  window.sessionStorage.setItem('userid', 'jess123');
  try {
    const response = await fetch(
      'https://us-central1-studywithme.cloudfunctions.net/api/profileInfo',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userid": window.sessionStorage.getItem('userid') })
      }
    );
    const json = await response.json();
    user = User.fromJson(json);
  } catch {
    user = User.fromJson({
      "picture": "Resources/Bob.jpg",
      "name": "Bob Ding",
      "interests": ["Basketball", "Climbing", "Sleeping", "Coding", "Hiking"],
      "courses": ["CSC207", "CSC209", "CSC236", "HPS101"]
    });
  }
  displayUser(user);

  /**
   * Saves the user's information.
   */
  async function onSave() {
    const userJson = {
      "userid": window.sessionStorage.getItem('userid'),
      "picture": user.picture,
      "name": document.getElementById('profile-name').innerHTML,
      "interests": document.getElementById('profile-interests').innerHTML,
      "courses": document.getElementById('profile-courses').innerHTML
    };
    await fetch(
      'https://us-central1-studywithme.cloudfunctions.net/api/editProfile',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userJson)
      }
    );
  }

  document.getElementById('save-button').addEventListener('click', onSave);
  document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = window.location.origin + '/home.html';
  });
  document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = window.location.origin + '/profile.html';
  });
});

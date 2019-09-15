window.addEventListener('load', () => {
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

  let user = new User(
    'Resources/Bob.jpg',
    'Bob Ding',
    ['Basketball', 'Climbing', 'Sleeping', 'Coding', 'Hiking'],
    ['CSC207', 'CSC209', 'CSC236', 'HPS101']
  );
  displayUser(user);

  /**
   * Saves the user's information.
   */
  function onSave() {
    user = new User(
      user.picture,
      document.getElementById('profile-name').innerHTML,
      document.getElementById('profile-interests').innerHTML,
      document.getElementById('profile-courses').innerHTML
    );
    console.log(user);
  }

  document.getElementById('save-button').addEventListener('click', onSave);
});

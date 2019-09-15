window.addEventListener('load', () => {
  const user = {
    'picture': 'Resources/Bob.jpg',
    'name': 'Bob Ding',
    'interests': ['Basketball', 'Climbing', 'Sleeping', 'Coding', 'Hiking'],
    'courses': ['CSC207', 'CSC209', 'CSC236', 'HPS101']
  };

  const profilePictureElement = document.getElementById("profile__picture");
  profilePictureElement.src = user.picture;

  const profileNameElement = document.getElementById("profile__name");
  profileNameElement.innerHTML = user.name;

  const profileInterestsElement = document.getElementById("profile__interests");
  profileInterestsElement.innerHTML = user.interests.join(", ");

  const profileCoursesElement = document.getElementById("profile__courses");
  profileCoursesElement.innerHTML = user.courses.join(", ");
});

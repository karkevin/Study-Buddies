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

    toHtml() {
      return `<div class="profile">
<img src="${this.picture}" class="profile__picture" width="100px" height="100px" />
<h2 class="profile__name">${this.name}</h2>
<p class="profile__interests">${this.interests.join(', ')}</p>
<p class="profile__courses">${this.courses.join(', ')}</p>
</div>`;
    }

    static fromJson(json) {
      return new User(json['picture'], json['name'], json['interests'], json['courses']);
    }
  }

  let users;
  try {
    const response = await fetch(
      'https://us-central1-studywithme.cloudfunctions.net/api/matches',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "userid": window.sessionStorage.getItem('userid') })
      }
    );
    const json = await response.json();
    users = json.map(User.fromJson);
  } catch {
    users = [
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
    ].map(User.fromJson);
  }

  const usersElement = document.getElementById('users');
  for (const user of users) {
    usersElement.innerHTML += user.toHtml();
  }

  document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = window.location.origin;
  });
  document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = window.location.origin + '/profile.html';
  });
});

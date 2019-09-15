window.addEventListener('load', () => {
  async function onLogin() {
    // Test account is jess123 and word.
    const credentials = {
      userid: document.getElementById('userId').value,
      password: document.getElementById('password').value
    };
    console.log(credentials);
    // Checks for a blank field.
    if (credentials.userid === '' || credentials.password ==='') {
      alert("Please enter a username and password.");
      return;
    }
    // Authenticates with the server.
    const response = await fetch(
      'https://us-central1-studywithme.cloudfunctions.net/api/login',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }
    );
    const json = await response.json();
    // Checks if login was successful.
    if (json.userExists && json.loginSuccessful) {
      sessionStorage.setItem('userid', json.userid);
      window.location.href = window.location.origin;
    } else {
      alert("Incorrect username or password.");
    }
  }

  document.getElementById('login-button').addEventListener('click', onLogin);
});

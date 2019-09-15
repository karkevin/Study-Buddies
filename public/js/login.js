window.addEventListener('load', async () => {
    const credentials = { username: "james45", password: "12345" };
    const response = await fetch(
        'https://us-central1-studywithme.cloudfunctions.net/api/login',
        {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }
    );
    console.log(response);
    const json = await response.json();
    console.log(json);
});

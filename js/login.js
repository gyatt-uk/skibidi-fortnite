
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect the user to the home page, or wherever you want
          window.location.href = '/index.html';
        } else {
          // Show the error message to the user
          document.getElementById('error-message').innerText = data.message;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

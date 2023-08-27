document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Replace these with your actual credentials validation logic
    const validUsername = 'roger';
    const validPassword = 'roger';

    if (username === validUsername && password === validPassword) {
        window.location.href = 'ocr.html'; // Redirect to the OCR page
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

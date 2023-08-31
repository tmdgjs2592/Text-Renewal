const backendUrl = "http://localhost:3000";

document.getElementById("signin-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check credentials (this is a basic example, replace with actual authentication logic)
    fetch(`${backendUrl}/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Sign in successful") {
            // Redirect to the dashboard page
            window.location.href = "hda.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

document.getElementById("register-button").addEventListener("click", function() {
    window.location.href = "reg.html";
});

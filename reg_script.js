const backendUrl = "http://localhost:3000";

document.getElementById("registration-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    // Send registration request to the server
    fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById("registration-message");
        const butElement = document.getElementById("si-button")
        if (data.message === "User registered successfully") {
            messageElement.textContent = "Registration successful!";
            messageElement.classList.remove(messageElement.classList)
            messageElement.classList.add("after");
            butElement.classList.remove("hidden");
        } else {
            messageElement.textContent = "Registration failed. Username may already exist.";
            messageElement.classList.remove(messageElement.classList)
            messageElement.classList.add("after");
        }
        
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
document.getElementById("si-button").addEventListener("click", function() {
    window.location.href = "sign.html";
});
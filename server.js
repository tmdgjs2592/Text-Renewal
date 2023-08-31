const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: "http://192.168.1.17:8080"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [];

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        res.status(400).json({ message: "Username already exists" });
    } else {
        users.push({ username, password });
        res.json({ message: "User registered successfully" });
    }
});

app.post("/signin", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: "Sign in successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

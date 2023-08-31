const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: "http://192.168.1.17:8080"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "your_mysql_username",
    password: "your_mysql_password",
    database: "hda_database"
});

connection.connect(err=>{
    if(err){
        console.error("Error connecting to the database", err);
    } else{
        console.log("Connected to MySQL database");
    }
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    const query = "SELECT * FROM users WHERE username =?";
    connection.query(quey, [username], (err, results) => {
        if(err){
            console.err("Error querying database:", err);
            res.status(500).json({ message: "Server error"});
            return;
        }

        if(results.length > 0){
            res.status(400).json({ message: "Username already exists" });
        }else{
            const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
            connection.query(insertQuery, [username, password], (inesrtErr) => {
                if(insertErr){
                    console.error("Error inserting into database:", insertErr);
                    res.status(500).json({ message: "Server error"});
                } else {
                    res.json({message: "User registered successfully"});
                }
            });
        }
    });
    
});

app.post("/signin", (req, res) => {
    const { username, password} = req.body;
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (err, results) =>{
        if(err){
            console.error("Error querying database:", err);
            res.status(500).json({ message: "Server error"});
            return;
        }

        if(results.length > 0){
            res.json({message: "Sign in successful"});
        }else{
            res.status(401).json({message: "Invalid credentials"});
        }

    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

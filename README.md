# Text-Renewal
1. http-server directory
2. node server.js
3. copy one of the given available address and open server.js file
4. where it says 'app.use(cors({origin: "http://..."}));' change the address in quotation mark.
5. go on the browser and search 'your address/signin.html'
6. 
USE hda_database;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

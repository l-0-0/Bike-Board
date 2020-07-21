const express = require("express");
const db = require("./db");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// the url in axios and here should be the same, it's the way that they communicate
app.get("/home", (req, res) => {
    db.getImage()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImage query from db", err);
        });
    //send the response to the client, browser
});

app.listen(8080, () => {
    console.log("server is listening");
});

const express = require("express");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

const app = express();

app.use(express.static("public"));
// app.use(express.static("upload"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//----FILE UPLOAD BOILERPLATE-----//
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//-----------------------------//

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

//file is comming from formDAta.append("file") in script. single is a method that uploader has
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    //if don't see this console.log, means we something wrong in uploader.single("file"). so we didn't append correctly!
    //we have to do console to see if the file uploaded correctly
    //if we upload correctly, we see the image on our upload folder
    const { title, description, username } = req.body;
    const { filename } = req.file;
    console.log("file:", req.file);
    console.log("input:", req.body);

    const url = s3Url + filename;

    db.addImage(title, description, username, url)
        .then((results) => {
            // console.log("results.rows:", results.rows);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addImage query: ", err);
        });
});

app.listen(8080, () => {
    console.log("server is listening");
});

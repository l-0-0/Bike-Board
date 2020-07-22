const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.accessKeyId,
    secretAccessKey: secrets.accessKeySecret,
});

exports.upload = function (req, res, next) {
    if (!req.file) {
        console.log("Multer failed");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

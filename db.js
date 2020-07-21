const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:Hoda@localhost:5432/imageboard"
);

module.exports.getImage = () => {
    let q = "SELECT * FROM images";
    return db.query(q);
};

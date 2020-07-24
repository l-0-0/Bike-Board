const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:Hoda@localhost:5432/imageboard"
);

module.exports.getImage = () => {
    let q = "SELECT * FROM images ORDER BY id DESC";
    return db.query(q);
};

module.exports.addImage = (title, description, username, url) => {
    let q =
        "INSERT INTO images (title, username, description, url) VALUES($1, $2, $3, $4) RETURNING title, description, username, url ";
    let params = [title, description, username, url];
    return db.query(q, params);
};

// module.exports.

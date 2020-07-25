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
    let q = `INSERT INTO images (title, username, description, url) 
    VALUES($1, $2, $3, $4) RETURNING title, description, username, url`;
    let params = [title, description, username, url];
    return db.query(q, params);
};

module.exports.getImageInfo = (id) => {
    let q = `SELECT * FROM images WHERE id=$1 `;
    let params = [id];
    return db.query(q, params);
};

module.exports.addComment = (id, comment, username) => {
    let q = `INSERT INTO comments (image_id, comment, username) 
    VALUES ($1, $2, $3) RETURNING image_id, comment, username, created_at`;
    let params = [id, comment, username];
    return db.query(q, params);
};

module.exports.getComments = (id) => {
    let q = "SELECT * FROM comments WHERE image_id=$1";
    let params = [id];
    return db.query(q, params);
};

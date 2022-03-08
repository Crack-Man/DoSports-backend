const db = require("../config/database.js").db;

const getRegions = (res) => {
    db.query(`SELECT * FROM regions ORDER BY time`, (err, data) => {
            if(err) {
                console.log(err);
                res(err, null);
            } else {
                res(null, data);
            }
        });   
}

module.exports.getRegions = getRegions;
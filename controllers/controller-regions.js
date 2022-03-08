const models = {
    regions: require("../models/model-regions.js")
}
 
const showRegions = (req, res) => {
    models.regions.getRegions((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

module.exports.showRegions = showRegions;
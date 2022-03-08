const models = {
    programs: require("../models/model-programs.js"),
}

const showLifestyles = (req, res) => {
    models.programs.getLifestyles((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

const showWeightCategories = (req, res) => {
    models.programs.getWeightCategories((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

module.exports.showLifestyles = showLifestyles;
module.exports.showWeightCategories = showWeightCategories;
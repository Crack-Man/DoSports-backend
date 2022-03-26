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

const createProgram = (req, res) => {
    let program = req.body;
    models.programs.addProgram(program, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const userHasActiveProgram = (req, res) => {
    let id = req.params.id;
    models.programs.countActiveProgramById(id, (err, data) => {
        if (err) {
            res.send({name: "Error", text: err});
        } else {
            res.send({name: "Success", text: !!data[0]["count"]});
        }
    })
}

const closeProgram = (req, res) => {
    let id = req.body.id;
    models.programs.deactivateProgram(id, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showProgram = (req, res) => {
    let id = req.body.id;
    models.programs.getProgramById(id, (err, data) => {
        if (err) {
            res.send({name: "Error", text: err});
        } else {
            res.send({name: "Success", program: data[0]});
        }
    })
}

module.exports.showLifestyles = showLifestyles;
module.exports.showWeightCategories = showWeightCategories;
module.exports.createProgram = createProgram;
module.exports.userHasActiveProgram = userHasActiveProgram;
module.exports.closeProgram = closeProgram;
module.exports.showProgram = showProgram;
const bcrypt = require('bcryptjs');

const models = {
    users: require("../models/model-users.js")
}
 
const showUsers = (req, res) => {
    models.users.getUsers((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const loginIsUnique = (req, res) => {
    return res.send(!models.users.countLogin(req));
}

const emailIsUnique = (req, res) => {
    return res.send(!models.users.countEmail(req));
}

const createUser = (req, res) => {
    let newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    newUser.code = bcrypt.hashSync(newUser.email, 10);
    models.users.addUser(newUser, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
}

const confirmUser = (req, res) => {
    let code = req.params.code;
    models.users.activateUser(code, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
}

module.exports.showUsers = showUsers;
module.exports.loginIsUnique = loginIsUnique;
module.exports.emailIsUnique = emailIsUnique;
module.exports.createUser = createUser;
module.exports.confirmUser = confirmUser;
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

const showLogins = (req, res) => {
    models.users.getLogins((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const showEmails = (req, res) => {
    models.users.getEmails((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const loginIsUnique = (req, res) => {
    let login = req.params.login;
    models.users.countLogin(login, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(!data[0]["count"]);
        }
    });
}

const emailIsUnique = (req, res) => {
    let email = req.params.email;
    models.users.countEmail(email, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(!data[0]["count"]);
        }
    });
}

const createUser = (req, res) => {
    let newUser = req.body;
    models.users.countEmail(newUser.email, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            if (!data[0]["count"]) {
                models.users.countLogin(newUser.login, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        if (!data[0]["count"]) {
                            newUser.password = bcrypt.hashSync(newUser.password, 10);
                            newUser.code = (bcrypt.hashSync(newUser.email, 10)).replaceAll("/", "a");
                            models.users.addUser(newUser, (err, data) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(data);
                                }
                            })
                        } else {
                            res.send("Пользователь с данным логином уже существует")
                        }
                    }
                })
            } else {
                res.send("Пользователь с данной электронной почтой уже существует")
            }
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

const testMail = (req, res) => {
    let email = req.params.email;
    models.users.sendMail(email, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
}

module.exports.showUsers = showUsers;
module.exports.showLogins = showLogins;
module.exports.showEmails = showEmails;
module.exports.loginIsUnique = loginIsUnique;
module.exports.emailIsUnique = emailIsUnique;
module.exports.createUser = createUser;
module.exports.confirmUser = confirmUser;
module.exports.testMail = testMail;
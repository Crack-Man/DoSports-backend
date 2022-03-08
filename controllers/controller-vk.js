const models = {
    users: require("../models/model-users.js"),
    vk: require("../models/model-vk.js"),
}

const controllers = {
    users: require("./controller-users.js")
}

const showUser = (req, res) => {
    res.json(req.user);
}

const createUserVk = (req, res) => {
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
                            newUser.gender = newUser.gender[0];
                            models.vk.addUserVk(newUser, (err, id) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.json({name: "Success", text: "", token: controllers.users.generateToken(id)});
                                }
                            })
                        } else {
                            res.send({name: "Error", text: "Пользователь с данным логином уже существует"})
                        }
                    }
                })
            } else {
                res.send({name: "Error", text: "Пользователь с данной электронной почтой уже существует"})
            }
        }
    })
}

const checkUserInDb = (req, res) => {
    let user = req.body;
    models.vk.countIdVk(user.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            if (data[0]["count"]) {
                res.json({name: "Success", match: true, token: controllers.users.generateToken(data[0]["id"])});
            }
        }
    })
}

module.exports.showUser = showUser;
module.exports.createUserVk = createUserVk;
module.exports.checkUserInDb = checkUserInDb;